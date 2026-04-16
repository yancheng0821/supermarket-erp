package com.supermarket.erp.module.system.service.role;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.system.controller.admin.role.vo.RolePageRespVO;
import com.supermarket.erp.module.system.controller.admin.role.vo.RoleSaveReqVO;
import com.supermarket.erp.module.system.dal.dataobject.MenuDO;
import com.supermarket.erp.module.system.dal.dataobject.RoleDO;
import com.supermarket.erp.module.system.dal.dataobject.RoleMenuDO;
import com.supermarket.erp.module.system.dal.mysql.MenuMapper;
import com.supermarket.erp.module.system.dal.mysql.RoleMapper;
import com.supermarket.erp.module.system.dal.mysql.RoleMenuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SystemRoleAdminService {

    private static final ErrorCode ROLE_NOT_FOUND = new ErrorCode(110301, "Role not found");
    private static final ErrorCode ROLE_CODE_EXISTS = new ErrorCode(110302, "Role code already exists in current tenant");
    private static final ErrorCode INVALID_ROLE_STATUS = new ErrorCode(110303, "Role status must be 0 or 1");
    private static final ErrorCode MENU_SCOPE_INVALID = new ErrorCode(110304, "Tenant roles cannot be assigned platform-only menus");
    private static final ErrorCode MENU_NOT_FOUND = new ErrorCode(110305, "Menu not found");
    private static final Set<Integer> VALID_STATUSES = Set.of(0, 1);

    private final RoleMapper roleMapper;
    private final RoleMenuMapper roleMenuMapper;
    private final MenuMapper menuMapper;

    public PageResult<RolePageRespVO> getRolePage(Long tenantId, PageParam pageParam, String name, String code,
                                                  Integer status) {
        LambdaQueryWrapper<RoleDO> query = new LambdaQueryWrapper<RoleDO>()
                .eq(RoleDO::getTenantId, tenantId)
                .like(StringUtils.hasText(name), RoleDO::getName, name)
                .like(StringUtils.hasText(code), RoleDO::getCode, code)
                .eq(status != null, RoleDO::getStatus, status)
                .orderByDesc(RoleDO::getId);
        PageResult<RoleDO> pageResult = roleMapper.selectPage(pageParam, query);
        List<RolePageRespVO> list = pageResult.getList().stream()
                .map(this::toPageRespVO)
                .toList();
        return new PageResult<>(list, pageResult.getTotal());
    }

    public Long createRole(Long tenantId, RoleSaveReqVO request) {
        validateStatus(request.getStatus());
        validateRoleCodeUnique(tenantId, request.getCode(), null);

        RoleDO role = new RoleDO();
        BeanUtils.copyProperties(request, role);
        role.setTenantId(tenantId);
        roleMapper.insert(role);
        return role.getId();
    }

    public void updateRole(Long tenantId, Long id, RoleSaveReqVO request) {
        validateStatus(request.getStatus());
        RoleDO role = getRoleOrThrow(tenantId, id);
        validateRoleCodeUnique(tenantId, request.getCode(), id);

        BeanUtils.copyProperties(request, role);
        role.setId(id);
        role.setTenantId(tenantId);
        roleMapper.updateById(role);
    }

    public void updateRoleStatus(Long tenantId, Long id, Integer status) {
        validateStatus(status);
        RoleDO role = getRoleOrThrow(tenantId, id);
        role.setStatus(status);
        roleMapper.updateById(role);
    }

    @Transactional
    public void assignMenus(Long tenantId, Long roleId, List<Long> menuIds) {
        getRoleOrThrow(tenantId, roleId);
        validateMenusAssignable(menuIds);

        roleMenuMapper.delete(new LambdaQueryWrapper<RoleMenuDO>()
                .eq(RoleMenuDO::getTenantId, tenantId)
                .eq(RoleMenuDO::getRoleId, roleId));

        if (menuIds == null || menuIds.isEmpty()) {
            return;
        }

        for (Long menuId : menuIds.stream().distinct().toList()) {
            RoleMenuDO roleMenu = new RoleMenuDO();
            roleMenu.setTenantId(tenantId);
            roleMenu.setRoleId(roleId);
            roleMenu.setMenuId(menuId);
            roleMenuMapper.insert(roleMenu);
        }
    }

    private RolePageRespVO toPageRespVO(RoleDO role) {
        RolePageRespVO response = new RolePageRespVO();
        BeanUtils.copyProperties(role, response);
        return response;
    }

    private RoleDO getRoleOrThrow(Long tenantId, Long id) {
        RoleDO role = roleMapper.selectOne(new LambdaQueryWrapper<RoleDO>()
                .eq(RoleDO::getTenantId, tenantId)
                .eq(RoleDO::getId, id)
                .last("LIMIT 1"));
        if (role == null) {
            throw new ServiceException(ROLE_NOT_FOUND);
        }
        return role;
    }

    private void validateRoleCodeUnique(Long tenantId, String code, Long excludeId) {
        Long count = roleMapper.selectCount(new LambdaQueryWrapper<RoleDO>()
                .eq(RoleDO::getTenantId, tenantId)
                .eq(RoleDO::getCode, code)
                .ne(excludeId != null, RoleDO::getId, excludeId));
        if (count != null && count > 0) {
            throw new ServiceException(ROLE_CODE_EXISTS);
        }
    }

    private void validateMenusAssignable(List<Long> menuIds) {
        if (menuIds == null || menuIds.isEmpty()) {
            return;
        }
        List<Long> distinctMenuIds = menuIds.stream().distinct().toList();
        List<MenuDO> menus = menuMapper.selectList(new LambdaQueryWrapper<MenuDO>()
                .in(MenuDO::getId, distinctMenuIds)
                .eq(MenuDO::getStatus, 0));
        if (menus.size() != distinctMenuIds.size()) {
            throw new ServiceException(MENU_NOT_FOUND);
        }
        boolean containsPlatformOnlyMenu = menus.stream()
                .map(MenuDO::getScope)
                .anyMatch("platform"::equals);
        if (containsPlatformOnlyMenu) {
            throw new ServiceException(MENU_SCOPE_INVALID);
        }
    }

    private void validateStatus(Integer status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new ServiceException(INVALID_ROLE_STATUS);
        }
    }
}

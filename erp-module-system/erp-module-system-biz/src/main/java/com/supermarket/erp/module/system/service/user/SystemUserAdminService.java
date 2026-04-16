package com.supermarket.erp.module.system.service.user;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.system.controller.admin.user.vo.UserPageRespVO;
import com.supermarket.erp.module.system.controller.admin.user.vo.UserSaveReqVO;
import com.supermarket.erp.module.system.dal.dataobject.AdminUserDO;
import com.supermarket.erp.module.system.dal.dataobject.RoleDO;
import com.supermarket.erp.module.system.dal.dataobject.UserRoleDO;
import com.supermarket.erp.module.system.dal.mysql.AdminUserMapper;
import com.supermarket.erp.module.system.dal.mysql.RoleMapper;
import com.supermarket.erp.module.system.dal.mysql.UserRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SystemUserAdminService {

    private static final ErrorCode USER_NOT_FOUND = new ErrorCode(110201, "User not found");
    private static final ErrorCode USERNAME_EXISTS = new ErrorCode(110202, "Username already exists in current tenant");
    private static final ErrorCode INVALID_USER_STATUS = new ErrorCode(110203, "User status must be 0 or 1");
    private static final ErrorCode PASSWORD_REQUIRED = new ErrorCode(110204, "Password must not be blank");
    private static final ErrorCode ROLE_NOT_FOUND = new ErrorCode(110205, "Role not found in current tenant");
    private static final Set<Integer> VALID_STATUSES = Set.of(0, 1);

    private final AdminUserMapper adminUserMapper;
    private final RoleMapper roleMapper;
    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;

    public PageResult<UserPageRespVO> getUserPage(Long tenantId, PageParam pageParam, String username,
                                                  String nickname, Integer status) {
        LambdaQueryWrapper<AdminUserDO> query = new LambdaQueryWrapper<AdminUserDO>()
                .eq(AdminUserDO::getTenantId, tenantId)
                .like(StringUtils.hasText(username), AdminUserDO::getUsername, username)
                .like(StringUtils.hasText(nickname), AdminUserDO::getNickname, nickname)
                .eq(status != null, AdminUserDO::getStatus, status)
                .orderByDesc(AdminUserDO::getId);
        PageResult<AdminUserDO> pageResult = adminUserMapper.selectPage(pageParam, query);
        List<UserPageRespVO> list = pageResult.getList().stream()
                .map(this::toPageRespVO)
                .toList();
        return new PageResult<>(list, pageResult.getTotal());
    }

    public Long createUser(Long tenantId, UserSaveReqVO request) {
        validateStatus(request.getStatus());
        if (!StringUtils.hasText(request.getPassword())) {
            throw new ServiceException(PASSWORD_REQUIRED);
        }
        validateUsernameUnique(tenantId, request.getUsername(), null);

        AdminUserDO user = new AdminUserDO();
        BeanUtils.copyProperties(request, user);
        user.setTenantId(tenantId);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        adminUserMapper.insert(user);
        return user.getId();
    }

    public void updateUser(Long tenantId, Long id, UserSaveReqVO request) {
        validateStatus(request.getStatus());
        AdminUserDO user = getUserOrThrow(tenantId, id);
        validateUsernameUnique(tenantId, request.getUsername(), id);

        BeanUtils.copyProperties(request, user, "password");
        user.setId(id);
        user.setTenantId(tenantId);
        adminUserMapper.updateById(user);
    }

    public void updateUserStatus(Long tenantId, Long id, Integer status) {
        validateStatus(status);
        AdminUserDO user = getUserOrThrow(tenantId, id);
        user.setStatus(status);
        adminUserMapper.updateById(user);
    }

    public void resetPassword(Long tenantId, Long id, String password) {
        if (!StringUtils.hasText(password)) {
            throw new ServiceException(PASSWORD_REQUIRED);
        }
        AdminUserDO user = getUserOrThrow(tenantId, id);
        user.setPassword(passwordEncoder.encode(password));
        adminUserMapper.updateById(user);
    }

    @Transactional
    public void assignRoles(Long tenantId, Long userId, List<Long> roleIds) {
        getUserOrThrow(tenantId, userId);
        validateRolesBelongToTenant(tenantId, roleIds);

        userRoleMapper.delete(new LambdaQueryWrapper<UserRoleDO>()
                .eq(UserRoleDO::getTenantId, tenantId)
                .eq(UserRoleDO::getUserId, userId));

        if (roleIds == null || roleIds.isEmpty()) {
            return;
        }

        for (Long roleId : roleIds.stream().distinct().toList()) {
            UserRoleDO userRole = new UserRoleDO();
            userRole.setTenantId(tenantId);
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            userRoleMapper.insert(userRole);
        }
    }

    private UserPageRespVO toPageRespVO(AdminUserDO user) {
        UserPageRespVO response = new UserPageRespVO();
        BeanUtils.copyProperties(user, response);
        return response;
    }

    private AdminUserDO getUserOrThrow(Long tenantId, Long id) {
        AdminUserDO user = adminUserMapper.selectOne(new LambdaQueryWrapper<AdminUserDO>()
                .eq(AdminUserDO::getTenantId, tenantId)
                .eq(AdminUserDO::getId, id)
                .last("LIMIT 1"));
        if (user == null) {
            throw new ServiceException(USER_NOT_FOUND);
        }
        return user;
    }

    private void validateUsernameUnique(Long tenantId, String username, Long excludeId) {
        Long count = adminUserMapper.selectCount(new LambdaQueryWrapper<AdminUserDO>()
                .eq(AdminUserDO::getTenantId, tenantId)
                .eq(AdminUserDO::getUsername, username)
                .ne(excludeId != null, AdminUserDO::getId, excludeId));
        if (count != null && count > 0) {
            throw new ServiceException(USERNAME_EXISTS);
        }
    }

    private void validateRolesBelongToTenant(Long tenantId, List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return;
        }
        List<Long> distinctRoleIds = roleIds.stream().distinct().toList();
        Long count = roleMapper.selectCount(new LambdaQueryWrapper<RoleDO>()
                .eq(RoleDO::getTenantId, tenantId)
                .in(RoleDO::getId, distinctRoleIds));
        if (count == null || count != distinctRoleIds.size()) {
            throw new ServiceException(ROLE_NOT_FOUND);
        }
    }

    private void validateStatus(Integer status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new ServiceException(INVALID_USER_STATUS);
        }
    }
}

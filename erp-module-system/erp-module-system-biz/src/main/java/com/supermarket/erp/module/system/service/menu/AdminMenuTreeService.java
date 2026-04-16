package com.supermarket.erp.module.system.service.menu;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.framework.security.core.LoginScope;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.module.system.controller.admin.auth.vo.AuthMenuRespVO;
import com.supermarket.erp.module.system.dal.dataobject.MenuDO;
import com.supermarket.erp.module.system.dal.dataobject.RoleMenuDO;
import com.supermarket.erp.module.system.dal.dataobject.UserRoleDO;
import com.supermarket.erp.module.system.dal.mysql.MenuMapper;
import com.supermarket.erp.module.system.dal.mysql.RoleMenuMapper;
import com.supermarket.erp.module.system.dal.mysql.UserRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminMenuTreeService {

    private final UserRoleMapper userRoleMapper;
    private final RoleMenuMapper roleMenuMapper;
    private final MenuMapper menuMapper;

    public List<AuthMenuRespVO> getMenuTree(LoginUser loginUser) {
        if (loginUser == null || loginUser.getLoginScope() == null) {
            return Collections.emptyList();
        }
        List<MenuDO> menus = loginUser.getLoginScope() == LoginScope.PLATFORM
                ? getPlatformMenus()
                : getTenantMenus(loginUser.getUserId());
        return buildTree(menus);
    }

    private List<MenuDO> getPlatformMenus() {
        return menuMapper.selectList(new LambdaQueryWrapper<MenuDO>()
                .eq(MenuDO::getStatus, 0)
                .in(MenuDO::getScope, "platform", "both")
                .orderByAsc(MenuDO::getSort, MenuDO::getId));
    }

    private List<MenuDO> getTenantMenus(Long userId) {
        List<UserRoleDO> userRoles = userRoleMapper.selectList(
                new LambdaQueryWrapper<UserRoleDO>().eq(UserRoleDO::getUserId, userId));
        if (userRoles.isEmpty()) {
            return Collections.emptyList();
        }
        Set<Long> roleIds = userRoles.stream().map(UserRoleDO::getRoleId).collect(Collectors.toSet());
        List<RoleMenuDO> roleMenus = roleMenuMapper.selectList(
                new LambdaQueryWrapper<RoleMenuDO>().in(RoleMenuDO::getRoleId, roleIds));
        if (roleMenus.isEmpty()) {
            return Collections.emptyList();
        }
        Set<Long> menuIds = roleMenus.stream().map(RoleMenuDO::getMenuId).collect(Collectors.toSet());
        return menuMapper.selectList(new LambdaQueryWrapper<MenuDO>()
                .in(MenuDO::getId, menuIds)
                .eq(MenuDO::getStatus, 0)
                .in(MenuDO::getScope, "tenant", "both")
                .orderByAsc(MenuDO::getSort, MenuDO::getId));
    }

    private List<AuthMenuRespVO> buildTree(List<MenuDO> menus) {
        if (menus.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Long, AuthMenuRespVO> nodeMap = menus.stream()
                .map(this::toRespVO)
                .collect(Collectors.toMap(AuthMenuRespVO::getId, Function.identity()));
        Map<Long, MenuDO> sourceMap = menus.stream()
                .collect(Collectors.toMap(MenuDO::getId, Function.identity()));

        List<AuthMenuRespVO> roots = new ArrayList<>();
        for (AuthMenuRespVO node : nodeMap.values()) {
            MenuDO source = sourceMap.get(node.getId());
            if (source == null || source.getParentId() == null || source.getParentId() == 0L
                    || !nodeMap.containsKey(source.getParentId())) {
                roots.add(node);
            } else {
                nodeMap.get(source.getParentId()).getChildren().add(node);
            }
        }

        sortTree(roots);
        return roots;
    }

    private void sortTree(List<AuthMenuRespVO> nodes) {
        nodes.sort(Comparator.comparing(AuthMenuRespVO::getId));
        for (AuthMenuRespVO node : nodes) {
            sortTree(node.getChildren());
        }
    }

    private AuthMenuRespVO toRespVO(MenuDO menu) {
        AuthMenuRespVO vo = new AuthMenuRespVO();
        vo.setId(menu.getId());
        vo.setName(menu.getName());
        vo.setPath(menu.getPath());
        vo.setComponent(menu.getComponent());
        vo.setIcon(menu.getIcon());
        vo.setPermission(menu.getPermission());
        return vo;
    }
}

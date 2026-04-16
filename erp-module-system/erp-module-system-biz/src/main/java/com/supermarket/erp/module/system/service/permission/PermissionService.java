package com.supermarket.erp.module.system.service.permission;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.module.system.dal.dataobject.MenuDO;
import com.supermarket.erp.module.system.dal.dataobject.RoleMenuDO;
import com.supermarket.erp.module.system.dal.dataobject.UserRoleDO;
import com.supermarket.erp.module.system.dal.mysql.MenuMapper;
import com.supermarket.erp.module.system.dal.mysql.RoleMenuMapper;
import com.supermarket.erp.module.system.dal.mysql.UserRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final UserRoleMapper userRoleMapper;
    private final RoleMenuMapper roleMenuMapper;
    private final MenuMapper menuMapper;

    public Set<String> getPlatformPermissions() {
        List<MenuDO> menus = menuMapper.selectList(
                new LambdaQueryWrapper<MenuDO>()
                        .eq(MenuDO::getStatus, 0)
                        .in(MenuDO::getScope, "platform", "both")
        );
        if (menus.isEmpty()) {
            return Collections.emptySet();
        }
        return menus.stream()
                .map(MenuDO::getPermission)
                .filter(permission -> permission != null && !permission.isEmpty())
                .collect(Collectors.toSet());
    }

    public Set<String> getPermissionsByUserId(Long userId) {
        // 1. Get role IDs by user ID
        List<UserRoleDO> userRoles = userRoleMapper.selectList(
                new LambdaQueryWrapper<UserRoleDO>().eq(UserRoleDO::getUserId, userId));
        if (userRoles.isEmpty()) {
            return Collections.emptySet();
        }
        Set<Long> roleIds = userRoles.stream()
                .map(UserRoleDO::getRoleId)
                .collect(Collectors.toSet());

        // 2. Get menu IDs by role IDs
        List<RoleMenuDO> roleMenus = roleMenuMapper.selectList(
                new LambdaQueryWrapper<RoleMenuDO>().in(RoleMenuDO::getRoleId, roleIds));
        if (roleMenus.isEmpty()) {
            return Collections.emptySet();
        }
        Set<Long> menuIds = roleMenus.stream()
                .map(RoleMenuDO::getMenuId)
                .collect(Collectors.toSet());

        // 3. Get permission strings from menus
        List<MenuDO> menus = menuMapper.selectList(
                new LambdaQueryWrapper<MenuDO>()
                        .in(MenuDO::getId, menuIds)
                        .eq(MenuDO::getStatus, 0)
                        .in(MenuDO::getScope, "tenant", "both"));
        return menus.stream()
                .map(MenuDO::getPermission)
                .filter(permission -> permission != null && !permission.isEmpty())
                .collect(Collectors.toSet());
    }
}

package com.supermarket.erp.module.system.service.menu;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.module.system.controller.admin.menu.vo.MenuSaveReqVO;
import com.supermarket.erp.module.system.controller.admin.menu.vo.MenuTreeRespVO;
import com.supermarket.erp.module.system.dal.dataobject.MenuDO;
import com.supermarket.erp.module.system.dal.mysql.MenuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuAdminService {

    private static final ErrorCode MENU_NOT_FOUND = new ErrorCode(110101, "Menu not found");
    private static final ErrorCode INVALID_MENU_SCOPE = new ErrorCode(110102, "Menu scope must be platform, tenant, or both");
    private static final ErrorCode INVALID_MENU_PERMISSION = new ErrorCode(110103, "Menu permission does not match the selected scope");
    private static final Set<String> VALID_SCOPES = Set.of("platform", "tenant", "both");

    private final MenuMapper menuMapper;

    public List<MenuTreeRespVO> getMenuTree(String scope) {
        validateScope(scope, false);
        LambdaQueryWrapper<MenuDO> query = new LambdaQueryWrapper<MenuDO>()
                .eq(StringUtils.hasText(scope), MenuDO::getScope, scope)
                .orderByAsc(MenuDO::getSort, MenuDO::getId);
        return buildTree(menuMapper.selectList(query));
    }

    public Long createMenu(MenuSaveReqVO request) {
        validateScope(request.getScope(), true);
        validatePermissionForScope(request.getScope(), request.getPermission());

        MenuDO menu = new MenuDO();
        BeanUtils.copyProperties(request, menu);
        menuMapper.insert(menu);
        return menu.getId();
    }

    public void updateMenu(Long id, MenuSaveReqVO request) {
        validateScope(request.getScope(), true);
        validatePermissionForScope(request.getScope(), request.getPermission());

        MenuDO menu = menuMapper.selectById(id);
        if (menu == null) {
            throw new ServiceException(MENU_NOT_FOUND);
        }
        BeanUtils.copyProperties(request, menu);
        menu.setId(id);
        menuMapper.updateById(menu);
    }

    private List<MenuTreeRespVO> buildTree(List<MenuDO> menus) {
        if (menus.isEmpty()) {
            return List.of();
        }

        Map<Long, MenuTreeRespVO> nodeMap = menus.stream()
                .map(this::toTreeRespVO)
                .collect(Collectors.toMap(MenuTreeRespVO::getId, Function.identity()));
        Map<Long, MenuDO> sourceMap = menus.stream()
                .collect(Collectors.toMap(MenuDO::getId, Function.identity()));

        List<MenuTreeRespVO> roots = new ArrayList<>();
        for (MenuTreeRespVO node : nodeMap.values()) {
            MenuDO source = sourceMap.get(node.getId());
            if (source == null || source.getParentId() == null || source.getParentId() == 0L
                    || !nodeMap.containsKey(source.getParentId())) {
                roots.add(node);
                continue;
            }
            nodeMap.get(source.getParentId()).getChildren().add(node);
        }

        sortTree(roots);
        return roots;
    }

    private void sortTree(List<MenuTreeRespVO> nodes) {
        nodes.sort(Comparator.comparing(MenuTreeRespVO::getSort, Comparator.nullsLast(Integer::compareTo))
                .thenComparing(MenuTreeRespVO::getId));
        for (MenuTreeRespVO node : nodes) {
            sortTree(node.getChildren());
        }
    }

    private MenuTreeRespVO toTreeRespVO(MenuDO menu) {
        MenuTreeRespVO response = new MenuTreeRespVO();
        BeanUtils.copyProperties(menu, response);
        return response;
    }

    private void validateScope(String scope, boolean required) {
        if (!StringUtils.hasText(scope)) {
            if (required) {
                throw new ServiceException(INVALID_MENU_SCOPE);
            }
            return;
        }
        if (!VALID_SCOPES.contains(scope)) {
            throw new ServiceException(INVALID_MENU_SCOPE);
        }
    }

    private void validatePermissionForScope(String scope, String permission) {
        if (!StringUtils.hasText(permission)) {
            return;
        }
        if ("platform".equals(scope) && !permission.startsWith("platform:")) {
            throw new ServiceException(INVALID_MENU_PERMISSION);
        }
        if (!"platform".equals(scope) && permission.startsWith("platform:")) {
            throw new ServiceException(INVALID_MENU_PERMISSION);
        }
    }
}

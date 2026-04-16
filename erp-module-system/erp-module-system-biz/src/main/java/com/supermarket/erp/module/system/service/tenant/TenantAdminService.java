package com.supermarket.erp.module.system.service.tenant;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.system.controller.admin.tenant.vo.TenantPageRespVO;
import com.supermarket.erp.module.system.controller.admin.tenant.vo.TenantSaveReqVO;
import com.supermarket.erp.module.system.dal.dataobject.TenantDO;
import com.supermarket.erp.module.system.dal.mysql.TenantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TenantAdminService {

    private static final ErrorCode TENANT_NOT_FOUND = new ErrorCode(110001, "Tenant not found");
    private static final ErrorCode TENANT_CODE_EXISTS = new ErrorCode(110002, "Tenant code already exists");
    private static final ErrorCode INVALID_TENANT_STATUS = new ErrorCode(110003, "Tenant status must be 0 or 1");
    private static final Set<Integer> VALID_STATUSES = Set.of(0, 1);

    private final TenantMapper tenantMapper;

    public PageResult<TenantPageRespVO> getTenantPage(PageParam pageParam, String code, String name, Integer status) {
        LambdaQueryWrapper<TenantDO> query = new LambdaQueryWrapper<TenantDO>()
                .like(StringUtils.hasText(code), TenantDO::getCode, code)
                .like(StringUtils.hasText(name), TenantDO::getName, name)
                .eq(status != null, TenantDO::getStatus, status)
                .orderByDesc(TenantDO::getId);
        PageResult<TenantDO> pageResult = tenantMapper.selectPage(pageParam, query);
        List<TenantPageRespVO> list = pageResult.getList().stream()
                .map(this::toPageRespVO)
                .toList();
        return new PageResult<>(list, pageResult.getTotal());
    }

    public Long createTenant(TenantSaveReqVO request) {
        validateStatus(request.getStatus());
        validateCodeUnique(request.getCode(), null);

        TenantDO tenant = new TenantDO();
        BeanUtils.copyProperties(request, tenant);
        tenantMapper.insert(tenant);
        return tenant.getId();
    }

    public void updateTenant(Long id, TenantSaveReqVO request) {
        validateStatus(request.getStatus());
        TenantDO tenant = getTenantOrThrow(id);
        validateCodeUnique(request.getCode(), id);

        BeanUtils.copyProperties(request, tenant);
        tenant.setId(id);
        tenantMapper.updateById(tenant);
    }

    public void updateTenantStatus(Long id, Integer status) {
        validateStatus(status);
        TenantDO tenant = getTenantOrThrow(id);
        tenant.setStatus(status);
        tenantMapper.updateById(tenant);
    }

    private TenantPageRespVO toPageRespVO(TenantDO tenant) {
        TenantPageRespVO response = new TenantPageRespVO();
        BeanUtils.copyProperties(tenant, response);
        return response;
    }

    private TenantDO getTenantOrThrow(Long id) {
        TenantDO tenant = tenantMapper.selectById(id);
        if (tenant == null) {
            throw new ServiceException(TENANT_NOT_FOUND);
        }
        return tenant;
    }

    private void validateCodeUnique(String code, Long excludeId) {
        Long count = tenantMapper.selectCount(new LambdaQueryWrapper<TenantDO>()
                .eq(TenantDO::getCode, code)
                .ne(excludeId != null, TenantDO::getId, excludeId));
        if (count != null && count > 0) {
            throw new ServiceException(TENANT_CODE_EXISTS);
        }
    }

    private void validateStatus(Integer status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new ServiceException(INVALID_TENANT_STATUS);
        }
    }
}

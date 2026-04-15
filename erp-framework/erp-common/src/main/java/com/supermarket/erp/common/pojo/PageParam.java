package com.supermarket.erp.common.pojo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class PageParam implements Serializable {

    @NotNull(message = "Page number must not be null")
    @Min(value = 1, message = "Page number must be at least 1")
    private Integer pageNo = 1;

    @NotNull(message = "Page size must not be null")
    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size must not exceed 100")
    private Integer pageSize = 10;
}

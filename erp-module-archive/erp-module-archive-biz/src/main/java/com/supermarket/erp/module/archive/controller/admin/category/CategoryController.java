package com.supermarket.erp.module.archive.controller.admin.category;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.module.archive.dal.dataobject.CategoryDO;
import com.supermarket.erp.module.archive.service.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/archive/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public CommonResult<Long> createCategory(@RequestBody CategoryDO category) {
        Long id = categoryService.createCategory(category);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateCategory(@RequestBody CategoryDO category) {
        categoryService.updateCategory(category);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<CategoryDO> getCategory(@PathVariable Long id) {
        CategoryDO category = categoryService.getCategory(id);
        return CommonResult.success(category);
    }

    @GetMapping("/tree")
    public CommonResult<List<CategoryDO>> getCategoryTree() {
        List<CategoryDO> list = categoryService.getCategoryTree();
        return CommonResult.success(list);
    }
}

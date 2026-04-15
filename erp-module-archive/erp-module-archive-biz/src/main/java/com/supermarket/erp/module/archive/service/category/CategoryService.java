package com.supermarket.erp.module.archive.service.category;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.module.archive.dal.dataobject.CategoryDO;
import com.supermarket.erp.module.archive.dal.mysql.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private static final ErrorCode CATEGORY_NOT_FOUND = new ErrorCode(100301, "Category not found");
    private static final ErrorCode CATEGORY_HAS_CHILDREN = new ErrorCode(100303, "Cannot delete category with children");

    private final CategoryMapper categoryMapper;

    public Long createCategory(CategoryDO category) {
        if (category.getParentId() != null && category.getParentId() > 0) {
            CategoryDO parent = categoryMapper.selectById(category.getParentId());
            if (parent == null) {
                throw new ServiceException(CATEGORY_NOT_FOUND);
            }
            category.setLevel(parent.getLevel() + 1);
        } else {
            category.setParentId(0L);
            category.setLevel(1);
        }
        categoryMapper.insert(category);
        return category.getId();
    }

    public void updateCategory(CategoryDO category) {
        validateCategoryExists(category.getId());
        categoryMapper.updateById(category);
    }

    public void deleteCategory(Long id) {
        validateCategoryExists(id);
        // Check no children
        List<CategoryDO> children = categoryMapper.selectList(
                new LambdaQueryWrapper<CategoryDO>().eq(CategoryDO::getParentId, id));
        if (!children.isEmpty()) {
            throw new ServiceException(CATEGORY_HAS_CHILDREN);
        }
        categoryMapper.deleteById(id);
    }

    public CategoryDO getCategory(Long id) {
        return categoryMapper.selectById(id);
    }

    public List<CategoryDO> getCategoryTree() {
        return categoryMapper.selectList(
                new LambdaQueryWrapper<CategoryDO>()
                        .orderByAsc(CategoryDO::getSort)
                        .orderByAsc(CategoryDO::getId));
    }

    private void validateCategoryExists(Long id) {
        if (categoryMapper.selectById(id) == null) {
            throw new ServiceException(CATEGORY_NOT_FOUND);
        }
    }
}

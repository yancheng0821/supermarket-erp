package com.supermarket.erp.module.system.api.user;

import com.supermarket.erp.module.system.api.user.dto.UserDTO;

public interface UserApi {

    UserDTO getUser(Long id);
}

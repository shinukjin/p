package com.w.p.service.user;

import com.w.p.dto.user.UserDTO.Signup;
import com.w.p.dto.user.UserDTO.SignupResponse;

public interface UserService {

    public SignupResponse signup(Signup request);

}

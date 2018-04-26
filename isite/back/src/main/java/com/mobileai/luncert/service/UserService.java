package com.mobileai.luncert.service;

import com.mobileai.luncert.entity.User;
import com.mobileai.luncert.mapper.UserMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public User validate(String name, String password) {
        User user = userMapper.queryByName(name);
        if (password.equals(user.getPassword())) return user;
        else return null;
    }

    public boolean validateByPass(String pass) {
        try {
            userMapper.queryByPass(pass);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void setPass(String name, String pass) {
        userMapper.setPass(name, pass);
    }

    public void setHeadimg(int user, String headimg) {
        userMapper.setHeadimg(user, headimg);
    }

    public String getHeadimg(int user) {
        return userMapper.getHeadimg(user);
    }

}
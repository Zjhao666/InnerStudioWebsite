package com.mobileai.luncert.service;

import java.util.HashMap;
import java.util.Map;

import com.mobileai.luncert.entity.User;
import com.mobileai.luncert.mapper.UserMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public User validate(String name, String password) {
        try {
            return userMapper.queryByPassword(name, password);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateByPass(int user, String pass) {
        try {
            userMapper.queryByPass(user, pass);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void setPass(String name, String pass) {
        userMapper.setPass(name, pass);
    }

    public void setName(int user, String name) {
        userMapper.setName(user, name);
    }

    public void setPassword(int user, String password) {
        userMapper.setPassword(user, password);
    }

    public String getName(int user) {
        return userMapper.getName(user);
    }

    public void setHeadimg(int user, String headimg) {
        userMapper.setHeadimg(user, headimg);
    }

    public String getHeadimg(int user) {
        return userMapper.getHeadimg(user);
    }

    public Map<Integer, String> getUserNames() {
        Map<Integer, String> ret = new HashMap<>();
        for (User user : userMapper.fetchAll()) ret.put(user.getId(), user.getName());
        return ret;
    }

}
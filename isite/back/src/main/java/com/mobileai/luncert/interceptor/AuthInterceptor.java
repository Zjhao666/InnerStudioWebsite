package com.mobileai.luncert.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mobileai.luncert.annotation.AuthAnnotation;
import com.mobileai.luncert.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


@Component
public class AuthInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        HandlerMethod methodHandler = (HandlerMethod) handler;
        AuthAnnotation auth = methodHandler.getMethodAnnotation(AuthAnnotation.class);
        if (auth != null) {
            if (userService.validateByPass(Integer.valueOf(request.getParameter("user")), request.getParameter("pass"))) return true;
            else return false;
        } else return true;
    }
    
}
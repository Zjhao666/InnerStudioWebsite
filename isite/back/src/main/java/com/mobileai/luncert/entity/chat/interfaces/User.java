package com.mobileai.luncert.entity.chat.interfaces;


public interface User extends Runnable {

    public void send(Message message);
    
    public void setUserManager(UserManager userManager);

    public UserManager getUserManager();
    
}
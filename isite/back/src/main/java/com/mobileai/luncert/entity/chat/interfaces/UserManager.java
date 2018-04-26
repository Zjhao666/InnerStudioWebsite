package com.mobileai.luncert.entity.chat.interfaces;



public interface UserManager {

    public boolean validate(int user, String pass);

    public boolean registed(int user);

    public void regisUser(int userId, User user);
    
}
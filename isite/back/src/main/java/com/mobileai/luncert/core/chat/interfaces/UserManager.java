package com.mobileai.luncert.core.chat.interfaces;



public interface UserManager {

    public boolean validate(int user, String pass);

    public boolean registed(int user);

    public void regisPass(int user, String pass);

    public void regisUser(int userId, User user);

    public void unRegisUser(User user) throws Exception;

}
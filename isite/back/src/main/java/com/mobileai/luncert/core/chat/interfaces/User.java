package com.mobileai.luncert.core.chat.interfaces;


public interface User extends Runnable {

    public int getId();

    public String getName();

    public void send(Message message);
    
    public void setUserManager(UserManager userManager);

    public void setTeamManager(TeamManager teamManager);

}
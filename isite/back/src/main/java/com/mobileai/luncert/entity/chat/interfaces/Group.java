package com.mobileai.luncert.entity.chat.interfaces;


public interface Group {

    public void addMember(User user);

    public void broadcast(Message message);
    
}
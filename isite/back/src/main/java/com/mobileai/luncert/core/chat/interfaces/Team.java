package com.mobileai.luncert.core.chat.interfaces;

import java.util.Date;
import java.util.Map;

import com.mobileai.luncert.service.chat.TeamHistoryService;


public interface Team {

    public int getId();

    public String getName();

    public void doInit(TeamHistoryService teamHistoryService);

    public Map<Date, String> getHistory();

    public void addMember(User user) throws Exception;

    public void delMember(User user);

    public void broadcast(Message message);
    
}
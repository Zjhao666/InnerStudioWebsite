package com.mobileai.luncert.core.chat.interfaces;

import java.util.List;

import com.mobileai.luncert.entity.chat.TeamHistory;
import com.mobileai.luncert.service.chat.TeamHistoryService;


public interface Team {

    public int getId();

    public String getName();

    public void doInit(TeamHistoryService teamHistoryService);

    public List<TeamHistory> getHistorys();

    public void addMember(User user) throws Exception;

    public void delMember(User user) throws Exception;

    public void broadcast(Message message);
    
}
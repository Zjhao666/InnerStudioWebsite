package com.mobileai.luncert.service.chat;

import java.util.List;

import com.mobileai.luncert.entity.chat.TeamHistory;
import com.mobileai.luncert.mapper.chat.TeamHistoryMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeamHistoryService {

    @Autowired
    private TeamHistoryMapper teamHistoryMapper;

    public List<TeamHistory> fetchAll(int teamId) {
        return teamHistoryMapper.fetchAll(teamId);
    }

    public void addHistory(TeamHistory item) {
        teamHistoryMapper.addHistory(item.getTeamId(), item.getUserId(), item.getContent(), item.getPtime(), item.getName());
    }

    public void addHistoryList(List<TeamHistory> list) {
        for(TeamHistory item : list) addHistory(item);
    }
}
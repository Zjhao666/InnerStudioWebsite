package com.mobileai.luncert.service.chat;

import java.util.List;

import com.mobileai.luncert.entity.chat.Team;
import com.mobileai.luncert.mapper.chat.TeamMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    @Autowired
    private TeamMapper teamMapper;

    /**
     * check if the name is used
     */
    private boolean beValidName(String name) {
        try {
            teamMapper.fetchOne(name).getName();
            return false;
        } catch (Exception e) {
            return true;
        }
    }

    public List<Team> fetchAll() {
        return teamMapper.fetchAll();
    }

    public int createTeam(String name) {
        if (beValidName(name)) {
            teamMapper.createTeam(name);
            return teamMapper.fetchOne(name).getId();
        } else return -1;
    }
    
}
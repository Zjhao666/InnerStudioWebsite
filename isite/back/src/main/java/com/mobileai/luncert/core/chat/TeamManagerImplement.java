package com.mobileai.luncert.core.chat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mobileai.luncert.core.chat.interfaces.Team;
import com.mobileai.luncert.core.chat.interfaces.TeamManager;
import com.mobileai.luncert.core.chat.interfaces.User;
import com.mobileai.luncert.service.chat.TeamHistoryService;
import com.mobileai.luncert.service.chat.TeamService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TeamManagerImplement implements TeamManager {

	private Map<Integer, Team> teamMap;

	@Autowired
	private TeamService teamService;

	@Autowired
	private TeamHistoryService teamHistoryService;

	private void doInit() {
		teamMap = new HashMap<>();
		for (com.mobileai.luncert.entity.chat.Team teamEntity : teamService.fetchAll()) {
			Team team = new TeamImplement(teamEntity.getId(), teamEntity.getName());
			team.doInit(teamHistoryService);
			teamMap.put(team.getId(), team);
		}
	}

	@Override
	public Map<Integer, String> queryTeam() {
		if (teamMap == null) doInit();
		Map<Integer, String> ret = new HashMap<>();
		for (int key : teamMap.keySet()) {
			ret.put(key, teamMap.get(key).getName());
		}
		return ret;
	}

	@Override
	public int createTeam(String name) {
		if (name.length() == 0) return -1;
		// access db to create group, then get the id and put into groupMap
		synchronized (this) {
			int id = teamService.createTeam(name);
			if (id != -1) {
				teamMap.put(id, new TeamImplement(id, name));
			}
			return id;
		}
	}

	@Override
	public Team joinTeam(int teamId, User user) throws Exception {
		Team team = teamMap.get(teamId);
		team.addMember(user);
		return team;
	}

}
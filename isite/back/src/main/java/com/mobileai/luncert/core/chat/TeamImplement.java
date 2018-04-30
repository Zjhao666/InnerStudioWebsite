package com.mobileai.luncert.core.chat;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mobileai.luncert.core.chat.interfaces.Team;
import com.mobileai.luncert.core.chat.interfaces.Message;
import com.mobileai.luncert.core.chat.interfaces.User;
import com.mobileai.luncert.entity.chat.TeamHistory;
import com.mobileai.luncert.service.chat.TeamHistoryService;

import net.sf.json.JSONObject;

public class TeamImplement implements Team {

	private int id;

	private String name;

	private Map<Integer, User> members;

	private List<TeamHistory> historys;

	private List<TeamHistory> newHistory;

	private TeamHistoryService teamHistoryService;

	public TeamImplement(int id, String name) {
		this.id = id;
		this.name = name;
		members = new HashMap<>();
		newHistory = new ArrayList<>();
	}

	@Override
	public int getId() { return id; }

	@Override
	public String getName() { return name; }

	@Override
	public void addMember(User user) throws Exception {
		// notify new member joined
		Message message = new MessageImplement(Message.NOTIFY_MEMBER_IN, user.getId(), user.getName());
		for (User item : members.values()) {
			item.send(message);
		}

		synchronized (this) {
			members.put(user.getId(), user);
		}

		// add newHistory to mysql and historys
		if (newHistory.size() > 0) {
			teamHistoryService.addHistoryList(newHistory);
			for (TeamHistory item : newHistory) historys.add(item);
			newHistory = new ArrayList<>();
		}

	}

	@Override
	public void delMember(User user) throws Exception {
		synchronized (this) {
			members.remove(user.getId(), user);
		}

		// notify member left
		Message message = new MessageImplement(Message.NOTIFY_MEMBER_OUT, user.getId());
		for (User item : members.values()) {
			item.send(message);
		}

		// add newHistory to mysql and historys
		if (newHistory.size() > 0) {
			teamHistoryService.addHistoryList(newHistory);
			for (TeamHistory item : newHistory) historys.add(item);
			newHistory = new ArrayList<>();
		}

	}

	@Override
	public void broadcast(Message message) {
		// add to newHistory
		int userId = message.getSource();
		newHistory.add(new TeamHistory(id, userId, new String(message.getContent()), new Date()));
		// add sender's name to message content
		JSONObject json = new JSONObject();
		json.put("content", new String(message.getContent()));
		json.put("name", members.get(userId).getName());
		message.setContent(json.toString().getBytes());
		for (User user : members.values()) {
			if (user.getId() == message.getSource()) continue;
			user.send(message);
		}
	}

	@Override
	public List<TeamHistory> getHistorys() {
		return historys;
	}

	@Override
	public List<JSONObject> getMembers() {
		List<JSONObject> ret = new ArrayList<>();
		for (User user : members.values()) {
			JSONObject obj = new JSONObject();
			obj.put("id", user.getId());
			obj.put("name", user.getName());
			ret.add(obj);
		}
		return ret;
	}

	/**
	 * called by TeamManager, beacause I can't init teamHistoryService with @Autowired
	 */

	@Override
	public void doInit(TeamHistoryService teamHistoryService) {
		synchronized (this) {
			this.teamHistoryService = teamHistoryService;
			this.historys = teamHistoryService.fetchAll(id);
		}
	}

}
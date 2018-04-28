package com.mobileai.luncert.core.chat;

import java.text.SimpleDateFormat;
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
		Message message = new MessageImplement(Message.NOTIFY_MEMBER_IN, user.getId());
		for (User item : members.values()) item.send(message);

		synchronized (this) {
			members.put(user.getId(), user);
		}

	}

	@Override
	public void delMember(User user) throws Exception {
		synchronized (this) {
			members.remove(user.getId(), user);
		}

		// notify member left
		Message message = new MessageImplement(Message.NOTIFY_MEMBER_OUT, user.getId());
		for (User item : members.values()) item.send(message);

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
		newHistory.add(new TeamHistory(id, message.getSource(), message.getContentString(), new Date()));
		for (User user : members.values()) {
			if (user.getId() == message.getSource()) continue;
			user.send(message);
		}
	}

	@Override
	public Map<String, String> getHistory() {
		Map<String, String> ret = new HashMap<>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(TeamHistory item : historys) ret.put(formatter.format(item.getPtime()), item.getContent());
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
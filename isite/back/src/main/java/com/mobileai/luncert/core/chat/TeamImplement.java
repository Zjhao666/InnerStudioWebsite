package com.mobileai.luncert.core.chat;

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

	private TeamHistoryService teamHistoryService;

	public TeamImplement(int id, String name) {
		this.id = id;
		this.name = name;
		members = new HashMap<>();
	}

	@Override
	public int getId() { return id; }

	@Override
	public String getName() { return name; }

	@Override
	public void addMember(User user) throws Exception {
		synchronized (this) {
			members.put(user.getId(), user);
		}

		Message message = new MessageImplement(Message.NOTIFY_NEWMEMBER, -1, user.getName());
		for (User itme : members.values()) itme.send(message);

	}

	@Override
	public void delMember(User user) {
		synchronized (this) {
			members.remove(user.getId());
		}
	}

	@Override
	public void broadcast(Message message) {
		historys.add(new TeamHistory(id, message.getSource(), message.getContentString(), new Date()));
		for (User user : members.values()) user.send(message);
	}

	@Override
	public Map<Date, String> getHistory() {
		Map<Date, String> ret = new HashMap<>();
		for(TeamHistory item : historys) ret.put(item.getPtime(), item.getContent());
		return ret;
	}

	/**
	 * called by TeamManager, beacause I can't init teamHistoryService with @Autowired
	 */

	@Override
	public void doInit(TeamHistoryService teamHistoryService) {
		this.teamHistoryService = teamHistoryService;
		this.historys = teamHistoryService.fetchAll(id);
	}

	public void destroy() {
		teamHistoryService.addHistoryList(historys);
	}

}
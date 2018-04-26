package com.mobileai.luncert.entity.chat;

import java.util.ArrayList;
import java.util.List;

import com.mobileai.luncert.entity.chat.interfaces.Group;
import com.mobileai.luncert.entity.chat.interfaces.Message;
import com.mobileai.luncert.entity.chat.interfaces.User;

public class GroupImplement implements Group {

	private List<User> members;

	public GroupImplement() {
		members = new ArrayList<>();
	}

	@Override
	public void addMember(User user) {
		members.add(user);
	}

	@Override
	public void broadcast(Message message) {
		for (User user : members) user.send(message);
	}
	
}
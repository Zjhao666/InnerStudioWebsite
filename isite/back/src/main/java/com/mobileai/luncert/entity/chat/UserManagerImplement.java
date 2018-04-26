package com.mobileai.luncert.entity.chat;

import java.util.HashMap;
import java.util.Map;

import com.mobileai.luncert.entity.chat.interfaces.User;
import com.mobileai.luncert.entity.chat.interfaces.UserManager;

public class UserManagerImplement implements UserManager {

	// private static final int MAXUSERS = 256;

	private Map<Integer, User> userMap;

	private Map<Integer, String> passMap;
	
	public UserManagerImplement() {
		userMap = new HashMap<>();
		passMap = new HashMap<>();
	}

	/**
	 * how do HTTP send pass to UserManager ??
	 */

	@Override
	public boolean validate(int userId, String pass) {
		return (passMap.containsKey(userId) && passMap.get(userId).equals(pass));
	}

	@Override
	public boolean registed(int user) {
		return userMap.containsKey(user);
	}

	@Override
	public void regisUser(int userId, User user) {
		userMap.put(userId, user);
		user.setUserManager(this);
	}

}
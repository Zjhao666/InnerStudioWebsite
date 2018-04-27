package com.mobileai.luncert.core.chat;

import java.util.HashMap;
import java.util.Map;

import com.mobileai.luncert.core.chat.interfaces.TeamManager;
import com.mobileai.luncert.core.chat.interfaces.User;
import com.mobileai.luncert.core.chat.interfaces.UserManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserManagerImplement implements UserManager {

	// private static final int MAXUSERS = 256;

	private Map<Integer, User> userMap;

	private Map<Integer, String> passMap;

	@Autowired
	private TeamManager teamManager;
	
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
	public boolean registed(int user) { return userMap.containsKey(user); }

	@Override
	public void regisPass(int user, String pass) {
		synchronized (this) {
			passMap.put(user,pass);
		}
	}

	/**
	 * if one user log in through HTTP, 
	 * he will have a new pass, 
	 * and the put method will overwrite the old pass with new pass
	 */
	@Override
	public void regisUser(int userId, User user) {
		synchronized (this) {
			userMap.put(userId, user);
			user.setUserManager(this);
			user.setTeamManager(teamManager);
		}
	}

	@Override
	public void unRegisUser(User user) throws Exception {
		synchronized (this) {
			int id = user.getId();
			if (userMap.containsKey(id)) {
				userMap.remove(id);
			} else throw new Exception("!!! User not exists: " + id);
		}
	}

}
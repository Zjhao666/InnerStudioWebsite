package com.mobileai.luncert.core.chat;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Date;
import java.util.Map;
import java.util.Map.Entry;

import com.mobileai.luncert.core.chat.interfaces.Team;
import com.mobileai.luncert.core.chat.interfaces.TeamManager;
import com.mobileai.luncert.core.chat.interfaces.Message;
import com.mobileai.luncert.core.chat.interfaces.User;
import com.mobileai.luncert.core.chat.interfaces.UserManager;
import com.mobileai.luncert.util.GenerateName;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class UserImplement implements User{

	private int id;

	private String name;

	private Socket conn;

	private Team team;
	
	private BufferedReader in;

	private PrintWriter out;

	private UserManager userManager;
	
	private TeamManager teamManager;

	public UserImplement(Socket conn, int id) throws Exception {
		this.conn = conn;
		this.id = id;
		this.name = GenerateName.generateName();
	}

	@Override
	public int getId() { return id; }

	@Override
	public String getName() { return name; }

	/**
	 * called by Group to broadcast Message
	 */
	@Override
	public void send(Message message) {
		out.print(message.getCharArray());
		out.flush();
	}

	private void send(char type) {
		send(new MessageImplement(type, this.id));
	}

	private void send(char type, String data) throws Exception {
		send(new MessageImplement(type, this.id, data));
	}
    
    @Override
    public void setUserManager(UserManager userManager) { this.userManager = userManager; }

	@Override
	public void setTeamManager(TeamManager teamManager) { this.teamManager = teamManager; }

	@Override
	public void run() {
		try {
			in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			out = new PrintWriter(conn.getOutputStream());
			// log in ack
			send(Message.ACK, this.name);
			while (true) {
				Message message = new MessageImplement(in);
				int type = message.getType();
				if (type == Message.SIGN_OUT) {
					// log out ack
					send(Message.ACK);
					System.out.println("--> end");
					break;
				}
				else if (type == Message.QUERY_GROUP) {
					Map<Integer, String> teams = teamManager.queryTeam();
					JSONArray data = new JSONArray();
					for (Entry<Integer, String> entry : teams.entrySet()) {
						data.add(entry);
					}
					send(Message.ACK, data.toString());
				}
				else if (type == Message.CREATE_GROUP) {
					String name = message.getContentString();
					int teamId = teamManager.createTeam(name);
					if (teamId != -1) {
						// create successfully
						team = teamManager.joinTeam(teamId, this);
						send(Message.ACK);
					} else send(Message.NAK);
				}
				else if (type == Message.JOIN_GROUP) {
					int teamId = Integer.valueOf(message.getContentString());
					team = teamManager.joinTeam(teamId, this);
					Map<Date, String> history = team.getHistory();
					JSONObject data = JSONObject.fromObject(history);
					send(Message.ACK, data.toString());
				}
				else if (type == Message.MESSAGE) {
					team.broadcast(message);
					send(Message.ACK);
				}
				else send(Message.NAK);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (team != null) team.delMember(this);
				userManager.unRegisUser(this);
				conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
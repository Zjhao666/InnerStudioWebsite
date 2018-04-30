package com.mobileai.luncert.core.chat;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
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
	
	private InputStream in;

	private OutputStream out;

	private UserManager userManager;
	
	private TeamManager teamManager;

	public UserImplement(Socket conn, int id, String name) throws Exception {
		this.conn = conn;
		this.id = id;
		this.name = name;
	}

	@Override
	public int getId() { return id; }

	@Override
	public String getName() { return name; }

	/**
	 * called by Group to broadcast Message
	 * @throws IOException
	 */
	@Override
	public void send(Message message) {
		try {
			out.write(message.toBytes());
			out.flush();
		} catch (IOException e) {
			e.printStackTrace();
			try {
				out.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
	}

	private void send(byte type) {
		send(new MessageImplement(type, this.id));
	}

	private void send(byte type, String data) throws Exception {
		send(new MessageImplement(type, this.id, data));
	}
    
    @Override
    public void setUserManager(UserManager userManager) { this.userManager = userManager; }

	@Override
	public void setTeamManager(TeamManager teamManager) { this.teamManager = teamManager; }

	@Override
	public void run() {
		try {
			in = conn.getInputStream();
			out = conn.getOutputStream();
			// response wth random name
			send(Message.REP, this.name);
			while (true) {
				Message message = new MessageImplement(in);
				int type = message.getType();
				if (type == Message.SIGN_OUT) break;
				else if (type == Message.QUERY_TEAM) {
					Map<Integer, String> teams = teamManager.queryTeam();
					JSONArray data = new JSONArray();
					for (Entry<Integer, String> entry : teams.entrySet()) {
						data.add(entry);
					}
					send(Message.REP, data.toString());
				}
				else if (type == Message.CREATE_TEAM) {
					String name = new String(message.getContent());
					int teamId = teamManager.createTeam(name);
					if (teamId != -1) {
						// create successfully
						team = teamManager.joinTeam(teamId, this);
						send(Message.REP);
					} else send(Message.ERR);
				}
				else if (type == Message.JOIN_TEAM) {
					if (team != null) team.delMember(this);
					int teamId = Integer.valueOf(new String(message.getContent()));
					team = teamManager.joinTeam(teamId, this);
					JSONArray historys = JSONArray.fromObject(team.getHistorys());
					JSONArray members = JSONArray.fromObject(team.getMembers());
					JSONObject data = new JSONObject();
					data.put("historys", historys);
					data.put("members", members);
					send(Message.REP, data.toString());
				}
				else if (type == Message.MESSAGE) {
					team.broadcast(message);
				}
				else send(Message.ERR); // !bug : when client closed socket, trying to read a message with type = 0 will not throw an exception, and server will send too much NAK message :(
			}
		} catch (EOFException e) { 
			System.out.println("--> client quited");
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
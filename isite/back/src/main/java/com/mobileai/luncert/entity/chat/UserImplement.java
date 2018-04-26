package com.mobileai.luncert.entity.chat;

import java.io.BufferedReader;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import com.mobileai.luncert.entity.chat.interfaces.Group;
import com.mobileai.luncert.entity.chat.interfaces.GroupManager;
import com.mobileai.luncert.entity.chat.interfaces.Message;
import com.mobileai.luncert.entity.chat.interfaces.User;
import com.mobileai.luncert.entity.chat.interfaces.UserManager;

public class UserImplement implements User{

	private Socket conn;

	private Group group;
	
	private BufferedReader in;

	private PrintWriter out;

	private UserManager userManager;
	
	private GroupManager groupManager;

	public UserImplement(Socket conn) {
		this.conn = conn;
	}

	@Override
	public void send(Message message) {
		out.print(message);
		out.flush();
	}
    
    @Override
    public void setUserManager(UserManager userManager) { this.userManager = userManager; }

    @Override
    public UserManager getUserManager() { return userManager; }

	@Override
	public void run() {
		try {
			in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			out = new PrintWriter(conn.getOutputStream());
			while (true) {
				Message message = new MessageImplement(in);
				int type = message.getType();
				if (type == Message.SIGN_OUT) {
					break;
				}
				else if (type == Message.MESSAGE) {
					group.broadcast(message);
				}
			}
		} catch (EOFException e) {

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				conn.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
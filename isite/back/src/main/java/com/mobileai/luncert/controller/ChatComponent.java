package com.mobileai.luncert.controller;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.mobileai.luncert.core.chat.interfaces.Message;
import com.mobileai.luncert.core.chat.interfaces.User;
import com.mobileai.luncert.core.chat.interfaces.UserManager;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.mobileai.luncert.core.chat.MessageImplement;
import com.mobileai.luncert.core.chat.UserImplement;

@Component
@Scope("singleton")
public class ChatComponent implements InitializingBean, Runnable {

    private final int PORT = 10983;
    
    private Thread mainThread;

    private ExecutorService threadPool;

	@Autowired(required = true)
    private UserManager userManager;

    public void regisPass(int user, String pass) {
        userManager.regisPass(user, pass);
    }

    public boolean registed(int user) {
        return userManager.registed(user);
    }

    @Override
    public void run() {
        threadPool = Executors.newCachedThreadPool();
        ServerSocket server = null;
        try {
            server = new ServerSocket(PORT);
            while (true) {
                try {
                    Socket conn = server.accept();
                    Message message = new MessageImplement(conn.getInputStream());
                    if (message.getType() == Message.SIGN_IN) {
                        int userId = message.getSource();
                        String pass = new String(message.getContent());
                        // if user registed or validate failed, end session
                        if (!userManager.registed(userId) && userManager.validate(userId, pass)) {
                            User user = new UserImplement(conn, userId);
                            userManager.regisUser(userId, user);
                            threadPool.execute(user);
                        } else conn.close();
                    } else conn.close();
                } catch (Exception e) {
                    System.out.println("! A connection occured exception: ");
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
		}
    }

	@Override
	public void afterPropertiesSet() throws Exception {
        if (mainThread == null) {
            mainThread = new Thread(this, "chat system");
            mainThread.start();
        }
	}

}
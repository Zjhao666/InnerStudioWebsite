package com.mobileai.luncert;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.mobileai.luncert.entity.chat.interfaces.GroupManager;
import com.mobileai.luncert.entity.chat.interfaces.Message;
import com.mobileai.luncert.entity.chat.interfaces.User;
import com.mobileai.luncert.entity.chat.interfaces.UserManager;
import com.mobileai.luncert.entity.chat.GroupManagerImplement;
import com.mobileai.luncert.entity.chat.MessageImplement;
import com.mobileai.luncert.entity.chat.UserImplement;
import com.mobileai.luncert.entity.chat.UserManagerImplement;

public class ChatDispatcher {

    private ExecutorService threadPool;

    private UserManager userManager;

    private GroupManager groupManager;

    public void run(int port) throws IOException{
        threadPool = Executors.newCachedThreadPool();
        userManager = new UserManagerImplement();
        groupManager = new GroupManagerImplement();
        ServerSocket server = new ServerSocket(port);
        try {
            while (true) {
                Socket conn = server.accept();
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                Message message = new MessageImplement(in);
                if (message.getType() == Message.SIGN_IN) {
                    int userId = Integer.valueOf(message.getContentString().substring(32));
                    String pass = message.getContentString().substring(0, 32);
                    // if user registed or validate failed, close connection
                    if (!userManager.registed(userId) && userManager.validate(userId, pass)) {
                        User user = new UserImplement(conn);
                        userManager.regisUser(userId, user);
                        threadPool.execute(user);
                    } else conn.close();
                } else conn.close();
            }
        } catch (Exception e) {
			e.printStackTrace();
        } finally {
            server.close();
        }
    }
}
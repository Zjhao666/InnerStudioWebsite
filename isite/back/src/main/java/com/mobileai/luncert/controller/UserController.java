package com.mobileai.luncert.controller;

import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import com.mobileai.luncert.annotation.AuthAnnotation;
import com.mobileai.luncert.entity.User;
import com.mobileai.luncert.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;



@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatController chatController;

    private String response(int code, String desc, Object data) {
        JSONObject json = new JSONObject();
        json.put("code", code);
        if (desc != null) json.put("desc", desc);
        if (data != null) json.put("data", data);
        return json.toString();
    }

    private String genPass(String name, String password) throws NoSuchAlgorithmException {
        StringBuilder builder = new StringBuilder();
        builder.append(name).append(password).append(new Date());
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] input = builder.toString().getBytes();
        md.update(input);
        byte[] md5Bytes = md.digest();
        BigInteger bigInteger = new BigInteger(1, md5Bytes);
        return bigInteger.toString(16);
    }

    /**
     * return User if validate successfully
     */
    @RequestMapping(value = "/validate", method = RequestMethod.GET)
    public String validate(String name, String password) throws Exception {
        User user = userService.validate(name, password);
        if (user != null) {
            String pass = genPass(name, password);
            userService.setPass(name, pass);
            user.setPass(pass);
            chatController.regisPass(user.getId(), pass);
            return response(200, null, JSONObject.fromObject(user));
        }
        else return response(201, "validate failed", null);
    }

    /**
     * this method should be debug after deploying on server, i should check if the new headimgs could be access
     */
    @AuthAnnotation
    @RequestMapping(value = "/uploadHeadimg", method = RequestMethod.POST)
    public String uploadHeadimg(@RequestPart("headimg") Part headimg, @RequestParam("user") int user) throws IOException {
        if (headimg.getSubmittedFileName().length() == 0) throw new NullPointerException("part: headimg is null");
        StringBuilder builder = new StringBuilder();
        String orgFileName = headimg.getSubmittedFileName();
        builder.append(request.getSession().getServletContext().getRealPath("/")).append("res/headimg/").append(user).append(orgFileName.substring(orgFileName.lastIndexOf(".")));
        String url = builder.toString();
        headimg.write(url);
        userService.setHeadimg(user, url);
        return response(200, null, null);
    }

    @AuthAnnotation
    @RequestMapping(value = "/getHeadimg")
    public String getHeadimg(int user) {
        return userService.getHeadimg(user);
    }

}
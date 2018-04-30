package com.mobileai.luncert.controller;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import com.mobileai.luncert.annotation.AuthAnnotation;
import com.mobileai.luncert.entity.User;
import com.mobileai.luncert.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;



@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatComponent chatComponent;

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
            if (!chatComponent.registed(user.getId())) {
                String pass = genPass(name, password);
                userService.setPass(name, pass);
                user.setPass(pass);
                chatComponent.regisPass(user.getId(), pass);
                return response(200, null, JSONObject.fromObject(user));
            } else return response(201, "user registed", null);
        } else return response(202, "validate failed", null);
    }

    /**
     * this method should be debug after deploying on server, i should check if the new headimgs could be access
     */
    @AuthAnnotation
    @PostMapping(value = "/uploadHeadimg")
    public String uploadHeadimg(@RequestParam("headimg") MultipartFile headimg, @RequestParam("user") int user) throws IOException {
        if (headimg.getOriginalFilename().length() == 0) throw new NullPointerException("part: headimg is null");
        String orgFileName = headimg.getOriginalFilename();
        StringBuilder builder = new StringBuilder().append("static/headimg/").append(user).append(orgFileName.substring(orgFileName.lastIndexOf(".")));
        String url = builder.toString();
        builder.insert(0, ClassLoader.getSystemResource(""));
        String path = builder.toString();
        if (path.startsWith("file:")) path = path.substring(5);
        File img = new File(path);
        img.createNewFile();
        headimg.transferTo(img);
        userService.setHeadimg(user, url);
        return response(200, null, url);
    }

    @AuthAnnotation
    @RequestMapping(value = "/getHeadimg")
    public String getHeadimg(int user) {
        return userService.getHeadimg(user);
    }

    @AuthAnnotation
    @RequestMapping(value = "/setPassword")
    public void setPassword(int user, String newPassword) {
        userService.setPassword(user, newPassword);
    }

    @AuthAnnotation
    @RequestMapping(value = "/setName")
    public void setName(int user, String newName) {
        userService.setName(user, newName);
    }

    @AuthAnnotation
    @RequestMapping(value = "/getUserNames")
    public String getUserNames() {
        Map<Integer, String> data = userService.getUserNames();
        JSONArray ret = new JSONArray();
        for(Entry<Integer, String> item : data.entrySet()) {
            ret.add(item);
        }
        return ret.toString();
    }

}
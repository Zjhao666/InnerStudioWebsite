package com.mobileai.luncert.controller.today;

import java.text.ParseException;
import java.text.SimpleDateFormat;


import com.mobileai.luncert.service.today.TaskService;
import com.mobileai.luncert.annotation.AuthAnnotation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import net.sf.json.JSONObject;


@RestController
@RequestMapping(value = "/today/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    private String response(int code, String desc, Object data) {
        JSONObject json = new JSONObject();
        json.put("code", code);
        if (desc != null) json.put("desc", desc);
        if (data != null) json.put("data", data);
        return json.toString();
    }

    @AuthAnnotation
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String addTask(@RequestBody String raw) throws ParseException {
        JSONObject jsonObject = JSONObject.fromObject(raw);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        taskService.addTask(jsonObject.getInt("user"), jsonObject.getString("content"), formatter.parse(jsonObject.getString("endTime")));
        return response(200, null, null);
    }

    @AuthAnnotation
    @RequestMapping("/lastWeek")
    public String lastWeek(int user) {
        return taskService.lastWeek(user);
    }

    @AuthAnnotation
    @RequestMapping("/lastMonth")
    public String lastMonth(int user) {
        return taskService.lastMonth(user);
    }

    @AuthAnnotation
    @RequestMapping("/lastThreeMonth")
    public String lastThreeMonth(int user) {
        return taskService.lastThreeMonth(user);
    }

    @AuthAnnotation
    @RequestMapping("/check")
    public String check(int id, boolean success) {
        taskService.check(id, success);
        return response(200, null, null);
    }

}
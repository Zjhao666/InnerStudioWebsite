package com.mobileai.luncert.controller.today;

import java.text.ParseException;
import java.text.SimpleDateFormat;


import com.mobileai.luncert.service.today.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


@RestController
@RequestMapping(value = "/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public void addTask(@RequestBody String raw) throws ParseException {
        JSONObject jsonObject = JSONObject.fromObject(raw);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        taskService.addTask(jsonObject.getInt("user"), jsonObject.getString("content"), formatter.parse(jsonObject.getString("endTime")));
    }

    @RequestMapping(value = "/lastWeek", method = RequestMethod.GET)
    public String lastWeek(int user) {
        JSONArray jsonArray = JSONArray.fromObject(taskService.lastWeek(user));
        return jsonArray.toString();
    }

}
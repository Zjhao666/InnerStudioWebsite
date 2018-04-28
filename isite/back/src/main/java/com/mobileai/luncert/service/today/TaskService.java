package com.mobileai.luncert.service.today;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.mobileai.luncert.entity.today.Task;
import com.mobileai.luncert.mapper.today.TaskMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
public class TaskService {

    @Autowired
    private TaskMapper taskMapper;

    private Date calcDatetime(int days) {
        Date date = new Date();
        Calendar now = Calendar.getInstance();
        now.setTime(date);
        now.add(Calendar.DAY_OF_YEAR, days);
        return now.getTime();
    }

    private String history(int user, int days) {
        JSONArray ret = new JSONArray();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        for (Task item : taskMapper.history(user, calcDatetime(days))) {
            JSONObject obj = new JSONObject();
            obj.put("id", item.getId());
            obj.put("content", item.getContent());
            obj.put("endTime", formatter.format(item.getEndTime()));
            ret.add(obj);
        }
        return ret.toString();
    }

    public void addTask(int user, String content, Date endTime) {
        taskMapper.add(new Task(user, content, endTime));
    }
    
    public String lastWeek(int user) {
        return history(user, -7);
    }

    public String lastMonth(int user) {
        return history(user, -30);
    }

    public String lastThreeMonth(int user) {
        return history(user, -90);
    }

    /**
     * 1. checking over timeout
     * 2. repeating check
     * 3. check with status success
     * 4. check with status failed
     * if check() return false, client should reload this task
     */
    public boolean check(int id, boolean success) {
        if (taskMapper.beTimeout(id)) {
            taskMapper.setTimeout(id);
            taskMapper.check(id, false);
            return false;
        }
        else if(!taskMapper.beChecked(id)) {
            taskMapper.check(id, success);
            return true;
        }
        return false;
    }
}
package com.mobileai.luncert.service.today;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.mobileai.luncert.entity.today.Task;
import com.mobileai.luncert.mapper.today.TaskMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    @Autowired
    private TaskMapper taskMapper;

    public void addTask(int user, String content, Date endTime) {
        taskMapper.add(new Task(user, content, endTime));
    }
    
    public Map<String, String> lastWeek(int user) {
        Date date = new Date();
        Calendar now = Calendar.getInstance();
        now.setTime(date);
        now.add(Calendar.DAY_OF_YEAR, -7);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Map<String, String> ret = new HashMap<>();
        for (Task item : taskMapper.lastWeek(user, now.getTime())) {
            ret.put(item.getContent(),formatter.format(item.getEndTime()));
        }
        return ret;
    }
}
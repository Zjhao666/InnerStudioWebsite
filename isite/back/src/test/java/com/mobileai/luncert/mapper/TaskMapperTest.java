package com.mobileai.luncert.mapper;

import com.mobileai.luncert.entity.today.Task;
import com.mobileai.luncert.mapper.today.TaskMapper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskMapperTest {

    @Autowired
    private TaskMapper taskMapper;

    @Test
    public void getAll() {
        taskMapper.add(new Task());
    }
}
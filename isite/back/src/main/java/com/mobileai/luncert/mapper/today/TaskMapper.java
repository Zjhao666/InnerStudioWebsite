
package com.mobileai.luncert.mapper.today;

import java.util.Date;
import java.util.List;

import com.mobileai.luncert.entity.today.Task;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;

public interface TaskMapper {
    
    @Insert("insert into TodayTask(user, content, endTime) values(#{user}, #{content}, #{endTime})")
    void add(Task task);

    @Select("select * from TodayTask where user = #{param1} and endTime > #{param2}")
    @Results({
        @Result(property = "content", column = "content", javaType = String.class),
        @Result(property = "endTime", column = "Date", javaType = Date.class)
    })
    List<Task> lastWeek(int user, Date startTime);
}
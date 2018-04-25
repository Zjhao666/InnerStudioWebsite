
package com.mobileai.luncert.mapper.today;

import java.util.Date;
import java.util.List;

import com.mobileai.luncert.entity.today.Task;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Insert;

public interface TaskMapper {
    
    @Insert("insert into TodayTask(user, content, endTime) values(#{user}, #{content}, #{endTime})")
    void add(Task task);

    @Select("select * from TodayTask where user = #{param1} and endTime > #{param2}")
    @Results({
        @Result(property = "id", column = "id", javaType = int.class),
        @Result(property = "content", column = "content", javaType = String.class),
        @Result(property = "endTime", column = "Date", javaType = Date.class)
    })
    List<Task> history(int user, Date startTime);

    // check

    @Select("select checked from TodayTask where id = #{id}")
    boolean beChecked(int id);

    @Update("update TodayTask set success = #{param2}, checked = true where id = #{param1}")
    void check(int id, boolean success);

    // timeout

    @Select("select  endTime - localtime() > 0 as timeout from TodayTask where id = #{param1}")
    @Result(column = "timeout", javaType = boolean.class)
    boolean beTimeout(int id);

    @Update("update TodayTask set timeout = true where id = #{param1}")
    void setTimeout(int id);
}
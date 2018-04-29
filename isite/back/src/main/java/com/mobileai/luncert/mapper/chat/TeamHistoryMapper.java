package com.mobileai.luncert.mapper.chat;

import java.util.Date;
import java.util.List;

import com.mobileai.luncert.entity.chat.TeamHistory;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

public interface TeamHistoryMapper {

    @Select("select * from TeamHistory where teamId = #{param1} ")
    @Results({
        @Result(property = "id", column = "id", javaType = int.class),
        @Result(property = "teamId", column = "teamId", javaType = int.class),
        @Result(property = "userId", column = "userId", javaType = int.class),
        @Result(property = "content", column = "content", javaType = String.class),
        @Result(property = "ptime", column = "ptime", javaType = Date.class),
        @Result(property = "name", column = "name", javaType = String.class)
    })
    public List<TeamHistory> fetchAll(int teamId);

    @Insert("insert into TeamHistory(teamId, userId, content, ptime, name) values(#{param1}, #{param2}, #{param3}, #{param4}, #{param5})")
    public void addHistory(int teamId, int userId, String content, Date ptime, String name);

}
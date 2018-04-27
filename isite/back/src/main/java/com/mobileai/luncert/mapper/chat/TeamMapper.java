package com.mobileai.luncert.mapper.chat;

import java.util.List;

import com.mobileai.luncert.entity.chat.Team;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

public interface TeamMapper {

    @Select("select id, name from Team")
    @Results({
        @Result(property = "id", column = "id", javaType = int.class),
        @Result(property = "name", column = "name", javaType = String.class)
    })
    public List<Team> fetchAll();

    @Select("insert into Team(name) values( #{param1} );")
    public void createTeam(String name);

    @Select("select * from Team where name = #{param1}")
    @Results({
        @Result(property = "id", column = "id", javaType = int.class),
        @Result(property = "name", column = "name", javaType = String.class)
    })
    public Team fetchOne(String name);
}
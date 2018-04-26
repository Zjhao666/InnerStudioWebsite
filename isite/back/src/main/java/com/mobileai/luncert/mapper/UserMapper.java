package com.mobileai.luncert.mapper;

import com.mobileai.luncert.entity.User;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface UserMapper {

    @Select("select * from User where name = #{param1} and password = #{param2}")
    @Results({
        @Result(property = "id", column = "id", javaType = int.class),
        @Result(property = "name", column = "name", javaType = String.class),
        @Result(property = "pass", column = "pass", javaType = String.class),
        @Result(property = "password", column = "password", javaType = String.class),
        @Result(property = "headimg", column = "headimg", javaType = String.class)
    })
    public User queryByPassword(String name, String password);

    @Select("select id from User where id = #{param1} and pass = #{param2}")
    @Result(column = "id", javaType = int.class)
    public int queryByPass(int user, String pass);

    @Update("update User set pass = #{param2} where name = #{param1}")
    public void setPass(String name, String pass);

    @Update("update User set headimg = #{param2} where id = #{param1}")
    public void setHeadimg(int user, String headimg);

    @Select("select headimg from User where id = #{param1}")
    @Result(column = "headimg", javaType = String.class)
    public String getHeadimg(int user);
    
}
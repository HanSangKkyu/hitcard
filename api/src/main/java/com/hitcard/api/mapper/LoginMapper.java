package com.hitcard.api.mapper;

import java.util.List;

import com.hitcard.api.model.User;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface LoginMapper {
    @Select("select * from USER WHERE ID = #{id} and PW = #{pw};")
    User login(@Param("id") String id, @Param("pw") String pw);
}
package com.hitcard.api.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.hitcard.api.model.User;

@Mapper
public interface UserMapper {

    @Select("select * from USER;")
    List<User> get();

    @Select("select * from USER;")
    User getOne(@Param("SN") String SN);

    @Insert("INSERT INTO USER( id, pw, introduction ) VALUES (#{id}, #{pw}, #{introduction} );")
    int insert(@Param("id") String id, @Param("pw") String pw, @Param("introduction") String introduction);

    @Update("UPDATE USER SET id = #{id}, pw = #{pw}, introduction = #{introduction} WHERE SN = #{SN}")
    int update(@Param("SN") String SN, @Param("id") String id, @Param("pw") String pw, @Param("introduction") String introduction);

    @Delete("DELETE FROM USER WHERE SN = #{SN}")
    int delete(@Param("SN") String SN);
}
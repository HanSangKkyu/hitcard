package com.hitcard.api.mapper;

import java.util.List;

import com.hitcard.api.model.Category;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CategoryMapper {

    @Select("select * from CATEGORY;")
    List<Category> get();

    @Select("select * from CATEGORY WHERE PROBLEM_SET = #{problemSet};")
    List<Category> getOfProblemSet(@Param("problemSet") String problemSet);

    @Select("select * from CATEGORY WHERE SN = #{SN};")
    Category getOne(@Param("SN") String SN);

    @Insert("INSERT INTO CATEGORY( NAME, PROBLEM_SET ) VALUES (#{name}, #{problemSet});")
    boolean insert(@Param("name") String name, @Param("problemSet") String problemSet);

    @Update("UPDATE CATEGORY SET NAME = #{name}, PROBLEM_SET = #{problemSet} WHERE SN = #{SN}")
    boolean update(@Param("SN") String SN, @Param("name") String name, @Param("problemSet") String problemSet);

    @Delete("DELETE FROM CATEGORY WHERE SN = #{SN}")
    boolean delete(@Param("SN") String SN);
}
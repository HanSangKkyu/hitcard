package com.hitcard.api.mapper;

import java.util.List;

import com.hitcard.api.model.Problem;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ProblemMapper {

    @Select("select * from PROBLEM;")
    List<Problem> get();

    @Select("select * from PROBLEM WHERE PROBLEM_SET = #{problemSet};")
    List<Problem> getOfProblemSet(@Param("problemSet") String problemSet);

    @Select("select * from PROBLEM WHERE CATEGORY = #{category};")
    List<Problem> getOfCategory(@Param("category") String category);

    @Select("select * from PROBLEM WHERE SN = #{SN};")
    Problem getOne(@Param("SN") String SN);

    @Insert("INSERT INTO PROBLEM( QUESTION, ANSWER, CATEGORY, HIT ) VALUES (#{question}, #{answer}, #{category}, #{hit} );")
    boolean insert(@Param("question") String question, @Param("answer") String answer, @Param("category") String category, @Param("hit") String hit);

    @Update("UPDATE PROBLEM SET QUESTION = #{question}, ANSWER = #{answer}, CATEGORY = #{category}, HIT = #{hit} WHERE SN = #{SN}")
    boolean update(@Param("SN") String SN, @Param("question") String question, @Param("answer") String answer, @Param("category") String category, @Param("hit") String hit);

    @Update("UPDATE PROBLEM SET HIT = (HIT+1) WHERE SN = #{SN}")
    boolean updateHitUp(@Param("SN") String SN);

    @Update("UPDATE PROBLEM SET HIT = (HIT-1) WHERE SN = #{SN}")
    boolean updateHitDown(@Param("SN") String SN);

    @Delete("DELETE FROM PROBLEM WHERE SN = #{SN}")
    boolean delete(@Param("SN") String SN);
}
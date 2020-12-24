package com.hitcard.api.mapper;

import java.util.List;

import com.hitcard.api.model.ProblemSet;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ProblemSetMapper {

    @Select("select * from PROBLEM_SET;")
    List<ProblemSet> get();

    @Select("select * from PROBLEM_SET WHERE OWNER = #{owner};")
    List<ProblemSet> getOfOwner(@Param("owner") String owner);

    @Select("select * from PROBLEM_SET WHERE SN = #{SN};")
    ProblemSet getOne(@Param("SN") String SN);

    @Insert("INSERT INTO PROBLEM_SET( name, owner, tag ) VALUES (#{name}, #{owner}, #{tag} );")
    boolean insert(@Param("name") String name, @Param("owner") String owner, @Param("tag") String tag);

    @Update("UPDATE PROBLEM_SET SET name = #{name}, owner = #{owner}, tag = #{tag}, hit = #{hit}, MODIFIED_DATE = CURRENT_TIMESTAMP() WHERE SN = #{SN}")
    boolean update(@Param("SN") String SN, @Param("name") String name, @Param("owner") String owner, @Param("tag") String tag, @Param("hit") String hit);

    @Update("UPDATE PROBLEM_SET SET HIT = (HIT+1) WHERE SN = #{SN}")
    boolean updateHitUp(@Param("SN") String SN);

    @Update("UPDATE PROBLEM_SET SET HIT = (HIT-1) WHERE SN = #{SN}")
    boolean updateHitDown(@Param("SN") String SN);

    @Delete("DELETE FROM PROBLEM_SET WHERE SN = #{SN}")
    boolean delete(@Param("SN") String SN);
}
package com.hitcard.api.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hitcard.api.common.Util;
import com.hitcard.api.mapper.ProblemMapper;
import com.hitcard.api.model.Problem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // 해당 origin 승인하기
public class ProblemController {

    @Autowired
	private ProblemMapper problemMapper;

    private String listToJson(List<Problem> _list) {
		String json = "{\"array\" : [";
        for (int i = 0; i < _list.size(); i++) {
			json+=_list.get(i).toString()+",";
		}
		if (json.charAt(json.length() - 1) == ',') {
			json = json.substring(0,json.length() - 1);
		}
        json += "]}";
        
        return json;
	}
	
	@RequestMapping(value = "/problem", method = RequestMethod.GET)
	public void problemGet(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

        Util.reponse_jobs(res, listToJson(problemMapper.get()));
	}

	@RequestMapping(value = "/category/{category}/problem", method = RequestMethod.GET)
	public void problemGetOfCategory(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("category") String category) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

        Util.reponse_jobs(res, listToJson(problemMapper.getOfCategory(category)));
	}	

	@RequestMapping(value = "/problem-set/{problemSet}/problem", method = RequestMethod.GET)
	public void problemGetOfProblemSet(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("problemSet") String problemSet) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

        Util.reponse_jobs(res, listToJson(problemMapper.getOfProblemSet(problemSet)));
	}	

	@RequestMapping(value = "/problem/{SN}", method = RequestMethod.GET)
	public void problemGetOne(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		System.out.println(_SN);
		Problem problem = problemMapper.getOne(_SN);

        Util.reponse_jobs(res, problem.toString());
	}

	@RequestMapping(value = "/problem", method = RequestMethod.POST)
	public void problemPost(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");
		String question = (String) map.get("question");
		String answer = (String) map.get("answer");
		String category = (String) map.get("category");
		String hit = (String) map.get("hit");

		Util.reponse_jobs(res,  problemMapper.insert(question, answer, category, hit)+"");
	}

	@RequestMapping(value = "/problem/{SN}", method = RequestMethod.PUT)
	public void problemPut(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		String question = (String) map.get("question");
		String answer = (String) map.get("answer");
		String category = (String) map.get("category");
		String hit = (String) map.get("hit");

		Util.reponse_jobs(res,  problemMapper.update(_SN, question, answer, category, hit)+"");
	}
	
	@RequestMapping(value = "/problem/{SN}/hitup", method = RequestMethod.PUT)
	public void problemPutHitUp(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");

		Util.reponse_jobs(res,  problemMapper.updateHitUp(_SN)+"");
	}
	
	@RequestMapping(value = "/problem/{SN}/hitdown", method = RequestMethod.PUT)
	public void problemPutHitDown(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");

		Util.reponse_jobs(res,  problemMapper.updateHitDown(_SN)+"");
	}
	
	@RequestMapping(value = "/problem/{SN}", method = RequestMethod.DELETE)
	public void problemDelete(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		Util.reponse_jobs(res,  problemMapper.delete(_SN)+"");
    }
}
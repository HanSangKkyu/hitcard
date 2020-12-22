package com.hitcard.api.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hitcard.api.common.Util;
import com.hitcard.api.mapper.ProblemSetMapper;
import com.hitcard.api.model.ProblemSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // 해당 origin 승인하기
public class ProblemSetController {

    @Autowired
	private ProblemSetMapper problemSetMapper;

    private String listToJson(List<ProblemSet> _list) {
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
	
	@RequestMapping(value = "/problem-set", method = RequestMethod.GET)
	public void problemSetGet(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

        Util.reponse_jobs(res, listToJson(problemSetMapper.get()));
	}

	@RequestMapping(value = "/problem-set/owner/{owner}", method = RequestMethod.GET)
	public void problemSetGetOfOwner(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("owner") String _owner) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");

        Util.reponse_jobs(res, listToJson(problemSetMapper.getOfOwner(_owner)));
	}

	@RequestMapping(value = "/problem-set/{SN}", method = RequestMethod.GET)
	public void problemSetGetOne(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		System.out.println(_SN);
		ProblemSet problemSet = problemSetMapper.getOne(_SN);

        Util.reponse_jobs(res, problemSet.toString());
	}

	@RequestMapping(value = "/problem-set", method = RequestMethod.POST)
	public void problemSetPost(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");
		String name = (String) map.get("name");
		String owner = (String) map.get("owner");
		String tag = (String) map.get("tag");

		Util.reponse_jobs(res,  problemSetMapper.insert(name, owner, tag)+"");
	}

	@RequestMapping(value = "/problemset/{SN}", method = RequestMethod.PUT)
	public void problemSetPut(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		String name = (String) map.get("name");
		String owner = (String) map.get("owner");
		String tag = (String) map.get("tag");
		String hit = (String) map.get("hit");

		Util.reponse_jobs(res,  problemSetMapper.update(_SN, name, owner, tag, hit)+"");
    }

	@RequestMapping(value = "/problemset/{SN}/hitup", method = RequestMethod.PUT)
	public void problemSetPutHitUp(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");

		Util.reponse_jobs(res,  problemSetMapper.updateHitUp(_SN)+"");
	}
	
	@RequestMapping(value = "/problemset/{SN}/hitdown", method = RequestMethod.PUT)
	public void problemSetPutHitDown(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");

		Util.reponse_jobs(res,  problemSetMapper.updateHitDown(_SN)+"");
    }

	@RequestMapping(value = "/problemset/{SN}", method = RequestMethod.DELETE)
	public void problemSetDelete(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		Util.reponse_jobs(res,  problemSetMapper.delete(_SN)+"");
    }
}
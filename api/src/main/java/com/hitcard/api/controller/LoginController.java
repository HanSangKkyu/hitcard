package com.hitcard.api.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hitcard.api.common.Util;
import com.hitcard.api.mapper.LoginMapper;
import com.hitcard.api.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // 해당 origin 승인하기
public class LoginController {

    @Autowired
	private LoginMapper LoginMapper;

    private String listToJson(List<User> _list) {
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
	
	// @RequestMapping(value = "/user", method = RequestMethod.GET)
	// public void userGet(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
	// 	System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

    //     Util.reponse_jobs(res, listToJson(userMapper.get()));
	// }

	// @RequestMapping(value = "/user/{SN}", method = RequestMethod.GET)
	// public void userGetOne(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
	// 	System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
	// 	System.out.println(_SN);
	// 	User user = userMapper.getOne(_SN);

    //     Util.reponse_jobs(res, user.toString());
	// }

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public void userPost(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");
		String id = (String) map.get("id");
		String pw = (String) map.get("pw");

        Util.reponse_jobs(res,  LoginMapper.login(id, pw).toString());
	}

	// @RequestMapping(value = "/user/{SN}", method = RequestMethod.PUT)
	// public void userPut(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
	// 	System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
	// 	String id = (String) map.get("id");
	// 	String pw = (String) map.get("pw");
	// 	String introduction = (String) map.get("introduction");

	// 	Util.reponse_jobs(res,  userMapper.update(_SN, id, pw, introduction)+"");
    // }

	// @RequestMapping(value = "/user/{SN}", method = RequestMethod.DELETE)
	// public void userDelete(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
	// 	System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
	// 	Util.reponse_jobs(res,  userMapper.delete(_SN)+"");
    // }
}
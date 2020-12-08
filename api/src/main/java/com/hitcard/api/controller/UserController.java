package com.hitcard.api.controller;

import java.util.List;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hitcard.api.mapper.UserMapper;
import com.hitcard.api.model.User;

@RestController
@CrossOrigin(origins = "*") // 해당 origin 승인하기
public class UserController {
    private void reponse_jobs(HttpServletResponse _res, String _json) throws IOException {
		// reponse 반복작업
		_res.setContentType("text/plain"); // 순수 Text로 응답을 해주겠다
		_res.setCharacterEncoding("UTF-8"); // 응답하는 Text의 Encoding을 설정한다
		PrintWriter writer = _res.getWriter(); // Response Body에 응답을 싣기 위해서 Writer객체를 하나 가져온다
		writer.write(_json); // 가져온 Write 객체에 응답할 Text를 작성한다.
		writer.flush(); // 응답을 보낸다.
		writer.close(); // 데이터 삭제
		
		return;
    }

    @Autowired
	private UserMapper userMapper;
	
	@RequestMapping(value = "/user", method = RequestMethod.GET)
	public void userGet(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		// userMapper.insert("han","han123","hello");
		List<User> userList = userMapper.get();

		String json = "";
		for (int i = 0; i < userList.size(); i++) {
			json+=userList.get(i).getId();
		}
        reponse_jobs(res, json);
	}

	@RequestMapping(value = "/user/{SN}", method = RequestMethod.GET)
	public void userGetOne(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		User user = userMapper.getOne(_SN);
        reponse_jobs(res, user.getId());
	}

	@RequestMapping(value = "/user", method = RequestMethod.POST)
	public void userPost(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		// userMapper.insert("han","han123","hello");
		List<User> userList = userMapper.get();
		for (int i = 0; i < userList.size(); i++) {
			System.out.println(userList.get(i).getId());
		}
		System.out.println();
        reponse_jobs(res, "hello1212331");
	}
	


	@RequestMapping(value = "/user/", method = RequestMethod.PUT)
	public void userPut(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		// userMapper.insert("han","han123","hello");
		List<User> userList = userMapper.get();
		for (int i = 0; i < userList.size(); i++) {
			System.out.println(userList.get(i).getId());
		}
		System.out.println();
        reponse_jobs(res, "hello1212331");
    }

	@RequestMapping(value = "/user/", method = RequestMethod.DELETE)
	public void userDelete(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		// userMapper.insert("han","han123","hello");
		List<User> userList = userMapper.get();
		for (int i = 0; i < userList.size(); i++) {
			System.out.println(userList.get(i).getId());
		}
		System.out.println();
        reponse_jobs(res, "hello1212331");
    }

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public void index(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
        reponse_jobs(res, "this is index");
    }

}
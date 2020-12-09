package com.hitcard.api.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hitcard.api.common.Util;
import com.hitcard.api.mapper.CategoryMapper;
import com.hitcard.api.model.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // 해당 origin 승인하기
public class CategoryController {

    @Autowired
	private CategoryMapper categoryMapper;

    private String listToJson(List<Category> _list) {
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
	
	@RequestMapping(value = "/category", method = RequestMethod.GET)
	public void CategoryGet(HttpServletRequest req, HttpServletResponse res, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

        Util.reponse_jobs(res, listToJson(categoryMapper.get()));
	}

	@RequestMapping(value = "/problem-set/{problemSet}/category", method = RequestMethod.GET)
	public void categoryGCategoryCategoryetOfCategory(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("problemSet") String problemSet) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");

        Util.reponse_jobs(res, listToJson(categoryMapper.getOfProblemSet(problemSet)));
	}	

	@RequestMapping(value = "/category/{SN}", method = RequestMethod.GET)
	public void categoryGetOne(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		System.out.println(_SN);
		Category category = categoryMapper.getOne(_SN);

        Util.reponse_jobs(res, category.toString());
	}

	@RequestMapping(value = "/category", method = RequestMethod.POST)
	public void categoryPost(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale) throws IOException, SQLException {
		System.out.println(Util.getTime() + ".=== " + req.getMethod() +" "+req.getRequestURL() + " ==========");
		String name = (String) map.get("name");
		String problemSet = (String) map.get("problemSet");

		Util.reponse_jobs(res,  categoryMapper.insert(name, problemSet)+"");
	}

	@RequestMapping(value = "/category/{SN}", method = RequestMethod.PUT)
	public void categoryPut(HttpServletRequest req, HttpServletResponse res, @RequestBody HashMap<String, Object> map, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		String name = (String) map.get("name");
		String problemSet = (String) map.get("problemSet");

		Util.reponse_jobs(res,  categoryMapper.update(_SN, name, problemSet)+"");
	}
	
	@RequestMapping(value = "/category/{SN}", method = RequestMethod.DELETE)
	public void categoryDelete(HttpServletRequest req, HttpServletResponse res, Locale locale, @PathVariable("SN") String _SN) throws IOException, SQLException {
		System.out.println("========== " + req.getRequestURL() + " " + req.getMethod() + " ==========");
		Util.reponse_jobs(res,  categoryMapper.delete(_SN)+"");
    }
}
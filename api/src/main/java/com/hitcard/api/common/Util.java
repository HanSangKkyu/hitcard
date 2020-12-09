package com.hitcard.api.common;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

public class Util{

    public static String getTime() {
        SimpleDateFormat format1 = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
        Date time = new Date();
        return format1.format(time);
    }

    public static void reponse_jobs(HttpServletResponse _res, String _json) throws IOException {
		// reponse 반복작업
		_res.setContentType("text/plain"); // 순수 Text로 응답을 해주겠다
		_res.setCharacterEncoding("UTF-8"); // 응답하는 Text의 Encoding을 설정한다
		PrintWriter writer = _res.getWriter(); // Response Body에 응답을 싣기 위해서 Writer객체를 하나 가져온다
		writer.write(_json); // 가져온 Write 객체에 응답할 Text를 작성한다.
		writer.flush(); // 응답을 보낸다.
		writer.close(); // 데이터 삭제
		
		return;
    }
}
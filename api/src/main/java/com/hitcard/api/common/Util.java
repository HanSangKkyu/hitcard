package com.hitcard.api.common;

import com.hitcard.api.common.Info;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

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
	
	private String sendHTTP(String PATH, String VERB, String PARAMETERS, Locale locale) throws IOException {
		// *eg) PATH = "/server", PARAMETERS = "id=sys&pw=sys1234"
		URL url = new URL(Info.apiURL + PATH);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		con.setRequestMethod(VERB); // optional default is GET
		if (VERB == "POST" || VERB == "PUT") {
			con.setDoOutput(true); // POST 파라미터 전달을 위한 설정
			// Send post request
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(PARAMETERS);
			wr.flush();
			wr.close();
		}

		int responseCode = con.getResponseCode();
		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine + "\n"); // 개행까지 포함하기 위해 "\n"을 붙임
		}
		in.close();

		// print result
		System.out.println("HTTP 상태코드 : " + responseCode);

		return response.toString();
	}
}
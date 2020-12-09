package com.hitcard.api.model;

public class User {
    private String SN;
    private String id;
    private String pw;
    private String introduction;
    
	public User(String sN, String id, String pw, String introduction) {
		SN = sN;
		this.id = id;
		this.pw = pw;
		this.introduction = introduction;
	}

	public String getSN() {
		return SN;
	}

	public void setSN(String sN) {
		SN = sN;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPw() {
		return pw;
	}

	public void setPw(String pw) {
		this.pw = pw;
	}

	public String getIntroduction() {
		return introduction;
	}

	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}
	
	public String toString(){
		String res = "{ "+
			"\"SN\" : \"" + SN + "\", " +
			"\"id\" : \"" + id + "\", " +
			"\"pw\" : \"" + pw + "\", " +
			"\"introduction\" : \"" + introduction + "\"" +
		" }";
		return res;
	}
    
}

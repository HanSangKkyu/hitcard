package com.hitcard.api.model;

public class ProblemSet {
    private String SN;
    private String name;
    private String owner;
    private String tag;
    private String hit;
    private String created_data;
    private String modified_data;

    public ProblemSet(String sN, String name, String owner, String tag, String hit, String created_data, String modified_data) {
        setSN(sN);
        this.setName(name);
        this.setOwner(owner);
        this.setTag(tag);
        this.setHit(hit);
        this.setCreated_data(created_data);
        this.setModified_data(modified_data);
    }

    public String getSN() {
        return SN;
    }

    public void setSN(String sN) {
        this.SN = sN;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getHit() {
        return hit;
    }

    public void setHit(String hit) {
        this.hit = hit;
    }

    public String getCreated_data() {
        return created_data;
    }

    public void setCreated_data(String created_data) {
        this.created_data = created_data;
    }

    public String getModified_data() {
        return modified_data;
    }

    public void setModified_data(String modified_data) {
        this.modified_data = modified_data;
    }

    public String toString(){
        String res = "{ "+
			"\"SN\" : \"" + SN + "\", " +
			"\"name\" : \"" + name + "\", " +
			"\"owner\" : \"" + owner + "\", " +
			"\"tag\" : \"" + tag + "\", " +
			"\"hit\" : \"" + hit + "\", " +
			"\"created_data\" : \"" + created_data + "\", " +
			"\"modified_data\" : \"" + modified_data + "\"" +
		" }";
		return res;
	}

}
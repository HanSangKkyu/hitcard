package com.hitcard.api.model;

public class Category {
    private String SN;
    private String name;
    private String problemSet;

    public Category(String sN, String name, String problemSet) {
        setSN(sN);
        this.setName(name);
        this.setProblemSet(problemSet);
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

    public String getProblemSet() {
        return problemSet;
    }

    public void setProblemSet(String problemSet) {
        this.problemSet = problemSet;
    }



}

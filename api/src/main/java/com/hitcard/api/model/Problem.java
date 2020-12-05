package com.hitcard.api.model;

public class Problem {
    private String SN;
    private String question;
    private String answer;
    private String category;
    private String hit;

    public Problem(String sN, String question, String answer, String category, String hit) {
        setSN(sN);
        this.setQuestion(question);
        this.setAnswer(answer);
        this.setCategory(category);
        this.setHit(hit);
    }

    public String getSN() {
        return SN;
    }

    public void setSN(String sN) {
        this.SN = sN;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getHit() {
        return hit;
    }

    public void setHit(String hit) {
        this.hit = hit;
    }


}

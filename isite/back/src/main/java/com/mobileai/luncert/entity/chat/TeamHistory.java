package com.mobileai.luncert.entity.chat;

import java.util.Date;

public class TeamHistory {

    private int id;

    private int teamId;

    private int userId;

    private String content;

    private Date ptime;

    public TeamHistory() {}

    public TeamHistory(int teamId, int userId, String content, Date ptime) {
        this.teamId = teamId;
        this.userId = userId;
        this.content = content;
        this.ptime = ptime;
    }

    public void setId(int id) { this.id = id; }

    public void setTeamId(int teamId) { this.teamId = teamId; }

    public void setUserId(int userId) { this.userId = userId; }

    public void setContent(String content) { this.content =  content; }

    public void setPtime(Date ptime) { this.ptime = ptime; }

    public int getId() { return id; }

    public int getTeamId() { return teamId; }

    public int getUserId() { return userId; }

    public String getContent() { return content; }

    public Date getPtime() { return ptime; }

}
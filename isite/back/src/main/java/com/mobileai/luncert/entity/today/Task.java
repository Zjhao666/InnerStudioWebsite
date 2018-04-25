package com.mobileai.luncert.entity.today;

import java.util.Date;

public class Task {
    private int id;
    private int user;
    private String content;
    private Date endTime;
    private boolean checked;
    private boolean success;

    public void setId(int id) { this.id = id; }
    public int getId() { return id; }
    public void setUser(int user) { this.user = user; }
    public int getUser() { return user; }
    public void setContent(String content) { this.content = content; }
    public String getContent() { return content; }
    public void setEndTime(Date endTime) { this.endTime = endTime; }
    public Date getEndTime() { return endTime; }
    public void setChecked(boolean checked) { this.checked = checked; }
    public boolean getChecked() { return checked; }
    public void setSuccess(boolean success) { this.success = success; }
    public boolean getSuccess() { return success; }

    public Task() {}
    public Task(int user, String content, Date endTime) {
        this.user = user;
        this.content = content;
        this.endTime = endTime;
    }
}
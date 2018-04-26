package com.mobileai.luncert.entity.chat.interfaces;



public interface Message {

    public static final char SIGN_IN = 0;
    
    public static final char SIGN_OUT = 1;

	public static final char QUERY_GROUP = 2;

	public static final char CREATE_GROUP = 3;

	public static final char SELECT_GROUP = 4;

	public static final char SELECT_LAST_GROUP = 5;

	public static final char MESSAGE= 6;

	public void setType(char type);

	public char getType();

	public void setContentLength(int contentLength);

	public int getContentLength();

	public void setContent(char[] content);

	public char[] getContent();
	
	public String getContentString();

}
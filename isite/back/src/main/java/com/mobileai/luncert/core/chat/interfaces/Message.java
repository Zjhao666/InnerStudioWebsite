package com.mobileai.luncert.core.chat.interfaces;



public interface Message {

    public static final char SIGN_IN = 0;
    
    public static final char SIGN_OUT = 1;

	public static final char QUERY_GROUP = 2;

	public static final char CREATE_GROUP = 3;

	public static final char JOIN_GROUP = 4;

	public static final char MESSAGE = 5;

	public static final char ACK = 6;

	public static final char NAK = 7;

	public static final char NOTIFY_NEWMEMBER = 8;

	public char getType();

	public int getSource();

	public int getContentLength();

	public void setContent(char[] content);

	public char[] getContent();
	
	public String getContentString();

	public char[] getCharArray();

}
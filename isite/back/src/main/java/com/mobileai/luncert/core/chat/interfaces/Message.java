package com.mobileai.luncert.core.chat.interfaces;



public interface Message {

    public static final byte SIGN_OUT = 0;

	public static final byte SIGN_IN = 1;
    
	public static final byte QUERY_TEAM = 2;

	public static final byte CREATE_TEAM = 3;

	public static final byte JOIN_TEAM = 4;

	public static final byte MESSAGE = 5;

	public static final byte REP = 6;

	public static final byte ERR = 7;

	public static final byte NOTIFY_MEMBER_IN = 8;

	public static final byte NOTIFY_MEMBER_OUT = 9;

	public byte getType();

	public int getSource();

	public int getContentLength();

	public byte[] getContent();
	
	public String getContentString();

	public byte[] toBytes();

}
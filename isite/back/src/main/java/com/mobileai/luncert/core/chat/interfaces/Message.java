package com.mobileai.luncert.core.chat.interfaces;



public interface Message {

    public static final byte SIGN_OUT = 0;

	public static final byte SIGN_IN = 1;
    
	public static final byte QUERY_GROUP = 2;

	public static final byte CREATE_GROUP = 3;

	public static final byte JOIN_GROUP = 4;

	public static final byte MESSAGE = 5;

	public static final byte ACK = 6;

	public static final byte NAK = 7;

	public static final byte NOTIFY_NEWMEMBER = 8;

	public byte getType();

	public int getSource();

	public int getContentLength();

	public byte[] getContent();
	
	public String getContentString();

	public byte[] toBytes();

}
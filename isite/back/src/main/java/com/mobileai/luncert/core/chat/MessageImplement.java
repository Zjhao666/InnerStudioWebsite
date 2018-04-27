package com.mobileai.luncert.core.chat;

import java.io.BufferedReader;
import java.io.EOFException;
import java.io.IOException;

import com.mobileai.luncert.core.chat.interfaces.Message;

public class MessageImplement implements Message{

    private static final char HEADER_LENGTH = 9;

    private static final int MAX_CONTENT_LENGTH = 4096;

    private char type;

    private int source;

    private int contentLength;

    private char[] content;

    public MessageImplement(BufferedReader in) throws IOException {
        // read header
        char[] header = new char[HEADER_LENGTH];
        int count = 0;
        while (count < HEADER_LENGTH) {
            int tmp = in.read(header, count, HEADER_LENGTH - count);
            if (tmp == 0) throw new EOFException("message header shorter than required " + HEADER_LENGTH);
            else count += tmp;
        }
        type = header[0];
        source = convertCharArray(header, 1);
        contentLength = convertCharArray(header, 5);
        // read content
        count = 0;
        content = new char[contentLength];
        while (count < contentLength) {
            int tmp = in.read(content, count, contentLength - count);
            if (tmp == 0) throw new EOFException("message shorter than required " + contentLength);
            else count += tmp;
        }
    }

    public MessageImplement(char type, int source) {
        this.type = type;
        this.source = source;
        this.contentLength = 0;
        this.content = null;
    }

    public MessageImplement(char type, int source, String content) throws Exception {
        this.contentLength = content.length();
        if (0 < contentLength && contentLength <= MAX_CONTENT_LENGTH) {
            this.type = type;
            this.source = source;
            this.content = content.toCharArray();
            this.contentLength = getContentLength(content);
        } else throw new Exception("content should shorter than " + MAX_CONTENT_LENGTH);
    }


    private int convertCharArray(char[] array, int offset) {
        // Little Endian
       return  array[offset] + (array[offset + 1] << 8) + (array[offset + 2] << 16) + (array[offset + 3] << 24);
    }

    /**
     * a Chainese character = 2 byte = 1 char, i need to return the byte num to client
     */
    private int getContentLength(String value) {
        System.out.println(value.length());
        int valueLength = 0;
        String chinese = "[\u0391-\uFFE5]";
        for (int i = 0; i < value.length(); i++) {
            String temp = value.substring(i, i + 1);
            if (temp.matches(chinese)) {
                valueLength += 3;
            } else {
                valueLength += 1;
            }
        }
        return valueLength;
    }

    /**
     * Little Endian
     */
    private void writeIntegerAsByte(int n, char[] sour, int offset) {
        for(int i = 0; i < 4; i++) {
            sour[i + offset] = (char) (n % 256);
            n = (int) ((n - sour[i + offset]) / 256);
        }
    }
    
    /**
     * calculate with content.length, and send getContentLenth()
     */
    @Override
    public char[] getCharArray() {
        int size = 1 + 4 + 4 + content.length;
        char[] ret = new char[size];
        ret[0] = type;
        writeIntegerAsByte(source, ret, 1);
        writeIntegerAsByte(contentLength, ret, 5);
        if (content != null) for(int i = 0; i < content.length; i++) ret[i + 9] = content[i];
        for(char i : ret) {
            System.out.print((int)i + " ");
        }
        System.out.println();
        return ret;
    }

    @Override
	public char getType() { return type; }

	@Override
	public int getSource() { return source; }

    @Override
	public int getContentLength() { return contentLength; }

    @Override
	public void setContent(char[] content) { 
        this.content = content;
        this.contentLength = content.length;
    }

    @Override
    public char[] getContent() { return content; }

	@Override
	public String getContentString() {
        return String.valueOf(content);
    }
    
}
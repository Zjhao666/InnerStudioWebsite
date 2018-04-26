package com.mobileai.luncert.entity.chat;

import java.io.BufferedReader;
import java.io.EOFException;
import java.io.IOException;

import com.mobileai.luncert.entity.chat.interfaces.Message;

public class MessageImplement implements Message{

    private static final char HEADERLENGTH = 5;

    private char type;

    private int contentLength;

    private char[] content;

    public MessageImplement(BufferedReader in) throws IOException {
        // read header
        char[] header = new char[HEADERLENGTH];
        int count = in.read(header);
        while (count < HEADERLENGTH) {
            int tmp = in.read(header, count, HEADERLENGTH - count);
            if (tmp == 0) throw new EOFException("message header shorter than required " + HEADERLENGTH);
            else count += tmp;
        }
        type = header[0];
        contentLength = header[1] + (header[2] << 8) + (header[3] << 16) + (header[4] << 24); // Little Endian
        // read content
        count = 0;
        content = new char[contentLength];
        while (count < contentLength) {
            int tmp = in.read(content, count, contentLength - count);
            if (tmp == 0) throw new EOFException("message shorter than required " + contentLength);
            else count += tmp;
        }
    }

    @Override
	public void setType(char type) { this.type = type; }

    @Override
	public char getType() { return type; }

    @Override
	public void setContentLength(int contentLength) { this.contentLength = contentLength; }

    @Override
	public int getContentLength() { return contentLength; }

    @Override
	public void setContent(char[] content) { this.content = content; }

    @Override
    public char[] getContent() { return content; }

	@Override
	public String getContentString() {
		return content.toString();
	}
    
}
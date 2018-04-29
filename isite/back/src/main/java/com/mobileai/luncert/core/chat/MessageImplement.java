package com.mobileai.luncert.core.chat;

import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;

import com.mobileai.luncert.core.chat.interfaces.Message;

public class MessageImplement implements Message{

    private static final char HEADER_LENGTH = 9;

    private static final int MAX_CONTENT_LENGTH = 10000000;

    private byte type;

    private int source;

    private int contentLength;

    private byte[] content;

    public MessageImplement(InputStream in) throws IOException {
        // read header
        byte[] header = new byte[HEADER_LENGTH];
        int count = 0;
        while (count < HEADER_LENGTH) {
            int tmp = in.read(header, count, HEADER_LENGTH - count);
            if (tmp <= 0) throw new EOFException("client closed");
            else count += tmp;
        }
        type = header[0];
        source = convertByteToInt(header, 1);
        contentLength = convertByteToInt(header, 5);
        // read content
        count = 0;
        content = new byte[contentLength];
        while (count < contentLength) {
            int tmp = in.read(content, count, contentLength - count);
            if (tmp <= 0) throw new EOFException("client closed");
            else count += tmp;
        }
    }

    public MessageImplement(byte type, int source) {
        this.type = type;
        this.source = source;
        this.contentLength = 0;
        this.content = null;
    }

    public MessageImplement(byte type, int source, String content) throws Exception {
        this.contentLength = content.length();
        if (0 < contentLength && contentLength <= MAX_CONTENT_LENGTH) {
            this.type = type;
            this.source = source;
            this.content = content.getBytes();
            this.contentLength = this.content.length;
        } else throw new Exception("content should shorter than " + MAX_CONTENT_LENGTH);
    }


    private int convertByteToInt(byte[] array, int offset) {
        // Little Endian
       return  (int)(array[offset] & 0xff) + (int)((array[offset + 1] << 8) & 0xff) + (int)((array[offset + 2] << 16) & 0xff) + (int)((array[offset + 3] << 24) & 0xff);
    }

    private void writeInteger(int n, byte[] source, int offset) {
        for(int i = 0; i < 4; i++) {
            source[i + offset] = (byte) (n % 256);
            n = (int) ((n - n % 256) / 256);
        }
    }

    /**
     * a unicode character need 2 bytes, a UTF-8 need 3 bytes.
        for (byte i : buf) {
            System.out.print((int)(i & 0xff) + " ");
        } System.out.println();
     * i need to return the byte num to client
     */
    @Override
    public byte[] toBytes() {
        int size = HEADER_LENGTH;
        if (content != null) size += contentLength;
        byte[] buf = new byte[size];
        buf[0] = type;
        writeInteger(source, buf, 1);
        writeInteger(contentLength, buf, 5);
        if (content != null) for (int i = 0; i < contentLength; i++) buf[i + HEADER_LENGTH] = content[i];
        return buf;
    }

    @Override
	public byte getType() { return type; }

	@Override
    public int getSource() { return source; }
    
    @Override
	public int getContentLength() { return contentLength; }

    @Override
    public byte[] getContent() { return content; }

    @Override
    public void setContent(byte[] content) {
        this.content = content;
        this.contentLength = content.length;
    }
    
}
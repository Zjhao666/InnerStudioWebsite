package home;

import beans.ServerConsole;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class swSCDownload extends HttpServlet {
    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try{
            ServerConsole s = new ServerConsole(); 
            String targetpath = request.getParameter("targetpath");
            PrintWriter out = response.getWriter();
            out.println(s.downloadDoc(targetpath));
        }catch(IOException e)
        {
            System.err.println(e);
        }
        
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doGet method.");
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }

}

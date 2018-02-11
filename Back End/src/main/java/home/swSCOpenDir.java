package home;

import beans.ServerConsole;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class swSCOpenDir extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String targetpath = request.getParameter("targetpath");
        try(PrintWriter out = response.getWriter()){
            if(targetpath.startsWith("/home/doc"))
            {
                ServerConsole s = new ServerConsole();
                out.println(s.GetTargetpathDoc(targetpath));
            }else
            {
                out.println("please visit correct targetpath.");
            }
        }catch(Exception e)
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
        }
    }

}

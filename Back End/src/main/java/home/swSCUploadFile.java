package home;

import beans.ServerConsole;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@MultipartConfig
public class swSCUploadFile extends HttpServlet {

    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doPost method.");
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        ServerConsole s = new ServerConsole();
        try{
            Collection<Part> parts = request.getParts();
            for(Part part : parts)
            {
                s.uploadDoc(part.getInputStream(),part.getName(), "/usr/doc");
            }
        }catch(IOException | ServletException e)
        {
            System.err.println(e);
        }
    }

}

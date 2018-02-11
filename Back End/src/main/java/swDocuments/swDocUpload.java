package swDocuments;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.Document;
import java.util.Collection;
import javax.servlet.http.Part;

public class swDocUpload extends HttpServlet {

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
        Document d = new Document();
        try{
            Collection<Part> parts = request.getParts();
            for(Part part : parts)
            {
                d.uploadDoc(part.getInputStream(),part.getName(), request.getParameter("targetpath"));
            }
        }catch(IOException | ServletException e)
        {
            System.err.println(e);
        }
        
    }

}

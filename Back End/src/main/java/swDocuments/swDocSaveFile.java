package swDocuments;

import beans.Document;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import net.sf.json.JSONObject;

@MultipartConfig
public class swDocSaveFile extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doPost method.");
        }catch(IOException e){
            System.err.println(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        Document d = new Document();
        JSONObject json = new JSONObject();
        PrintWriter out = response.getWriter();
        try{
            Collection<Part> parts = request.getParts();
            for(Part part : parts)
            {
                d.uploadDoc2(part.getInputStream(),"临时文件", "/home/doc");
            }
            json.put("statuscode", "200");
            out.println(json.toString());
        }catch(IOException | ServletException e)
        {
            json.put("statuscode", "201");
            out.println(json.toString());
            System.err.println(e);
        }
    }

}

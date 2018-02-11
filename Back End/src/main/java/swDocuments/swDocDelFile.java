package swDocuments;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.Document;
import net.sf.json.JSONObject;

public class swDocDelFile extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try{
            Document d = new Document();
            int result = d.DocDelete(request.getParameter("targetpath"));
            JSONObject json = new JSONObject();
            json.put("statuscode", result);
            PrintWriter out = response.getWriter();
            out.println(json);
        }catch(IOException e){
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
        }catch(IOException e){
            System.err.println(e);
        }
    }

}

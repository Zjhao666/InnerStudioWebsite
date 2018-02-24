package swRegisProject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import java.sql.Statement;
import beans.Document;
import java.io.File;
import java.io.FileWriter;
import java.io.OutputStreamWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import net.sf.json.JSONObject;

public class swRegisProject extends HttpServlet {

    public int RegisProject(String captainId, String members, String title, String overview, String projectDoc){
        try{
            Document D = new Document();
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "insert into Project (captainId, members, title, overview) values ("+captainId+",'"+members+"','"+title+"','"+overview+"');";
            statement.execute(sql);
            String[] Members = members.split(",");
            sql = "select id from Project where title = '" + title+"'";
            ResultSet rs = statement.executeQuery(sql);
            String project_id = null;
            if(rs.next()){
                project_id = rs.getString("id");
            }
            for(String member : Members){
                sql = "update Member set curProject = "+ project_id +" where id = " + member +"";
                statement.execute(sql);
            }
            if(projectDoc != null){
                File file = new File("/usr/doc/InnerStudioWebsite/"+title+".txt");
                if(!file.exists()){
                    try {
                        file.createNewFile();
                        PrintWriter out = new PrintWriter(file);
                        out.write(projectDoc);
                        out.flush();
                        out.close();
                    } catch (IOException e) {
                    System.err.println(e);
                    }
                }
            }
            return 200;
       }catch(SQLException e){
           System.err.println(e);
           return 201;
       }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter()){
            out.println("please use doPost method.");
        }catch(IOException e){
            System.err.println(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("text/html;charset=utf-8"); 
        try(PrintWriter out = response.getWriter()){
            String captainId = request.getParameter("captainId");
            String members = request.getParameter("members");
            String title = request.getParameter("title");
            String overview = request.getParameter("overview");
            String projectDoc = request.getParameter("projectDoc");
            int result = RegisProject(captainId, members, title, overview, projectDoc);
            JSONObject json = new JSONObject();
            json.put("statuscode", result);
            out.println(json.toString());
        }catch(IOException e){
            System.err.println(e);
        }

    }
}

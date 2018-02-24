package plan;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import java.sql.SQLException;
import java.sql.Statement;
import net.sf.json.JSONObject;

public class swPlanUpdate extends HttpServlet {

    public int PlanUpdate(String target_id, String content){
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "update Plan set content = '" + content +"' where id ="+ target_id;
            statement.execute(sql);
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
        try(PrintWriter out = response.getWriter()){
            String target_id = request.getParameter("target_id");
            String content = request.getParameter("content");
            JSONObject json = new JSONObject();
            json.put("statuscode", PlanUpdate(target_id, content));
            out.println(json.toString());
        }catch(IOException e){
            System.err.println(e);
        }
    }

}

package plan;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import net.sf.json.JSONObject;

public class swSendNotice extends HttpServlet {

    public int SendNotice(String target_id, String content)
    {
        try{
            String[] ids = target_id.split(",");
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select * from Plan where content = '"+content+"'";
            ResultSet rs = statement.executeQuery(sql);
            String Plan_id = null;
            if(rs.next()){
                Plan_id = rs.getString("id");
            }
            for(String id : ids){
                sql = "update Member set curPlan = "+ Plan_id +", curPlan_content = '"+ content +"' where id = "+ id;
                statement.execute(sql);
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
        try(PrintWriter out = response.getWriter()){
            int statuscode = SendNotice(request.getParameter("target_id"), request.getParameter("content"));
            JSONObject json = new JSONObject();
            json.put("statuscode", statuscode);
            out.println(json.toString());
        }catch(IOException e){
            System.err.println(e);
        }
    }


}

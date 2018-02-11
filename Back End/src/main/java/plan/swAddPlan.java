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

public class swAddPlan extends HttpServlet {

    public int AddPlan(String content) throws SQLException
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            int i = 1;
            String sql = "select * from plan where id = "+i+";";
            ResultSet rs = statement.executeQuery(sql);
            while(rs.next()){
                i++;
            }
            sql = "insert plan (id, content) values ("+i+",'"+content+"',');";
            if(statement.execute(sql)){
                return 200;
            }else{
                return 201;
            }
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
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter()){
            String content = request.getParameter("content");
            int result = AddPlan(content);
            JSONObject json = new JSONObject();
            json.put("statuscode", result);
            out.println(json.toString());
        }catch(SQLException e){
            System.err.println(e);
        }
    }

}

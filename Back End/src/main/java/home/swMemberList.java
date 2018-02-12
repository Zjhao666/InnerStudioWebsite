package home;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import beans.ConnectDatabase;
import net.sf.json.JSONObject;

public class swMemberList extends HttpServlet {
    
    public String Member()
    {
        try
        {
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            List<JSONObject> list = new ArrayList<>();
            ResultSet rs = statement.executeQuery("Select * from Member;");
            while(rs.next())
            {
                JSONObject json = new JSONObject();
                json.put("id", String.valueOf(rs.getInt("id")));
                json.put("isOline", rs.getString("isOnline"));
                json.put("pertag", rs.getString("pertag"));
                json.put("isCaptain", rs.getString("isCaptain"));
                list.add(json);
            }
            rs.close();
            statement.close();
            return JSONArray.fromObject(list).toString();
        }catch(SQLException e){
            System.out.println(e);
            return null;
        }
    }
    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println(Member());
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

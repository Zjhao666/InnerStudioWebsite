package home;

import beans.ConnectDatabase;
import beans.Plan;
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

public class swProjectList extends HttpServlet {
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
    }

    public String latestPlan()
    {
        try
        {
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select * from Plan order by updateTime desc;";
            ResultSet rs = statement.executeQuery(sql);
            List<Plan> list = new ArrayList<>();
            while(rs.next())
            {
                Plan tmp = new Plan();
                tmp.setId(rs.getInt("id"));
                tmp.setUpdateTime(rs.getString("updateTime"));
                tmp.setTitle("Title");
                tmp.setContent(rs.getString("content"));
                list.add(tmp);
            }
            JSONArray jobj = JSONArray.fromObject(list);
            return jobj.toString();
        }catch(SQLException e)
        {
            System.err.println(e);
            return null;
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println(latestPlan());
        }
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doGet method.");
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }

}

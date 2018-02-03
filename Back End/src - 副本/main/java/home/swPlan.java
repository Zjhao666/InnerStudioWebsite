package home;

import beans.Plan;
import beans.ConnectDatabase;
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

public class swPlan extends HttpServlet {
    
    public String plan()
    {
        try
        {
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select * from Plan;";
            ResultSet rs = statement.executeQuery(sql);
            List<Plan> list = new ArrayList<>();
            while(rs.next())
            {
                Plan tmp = new Plan();
                tmp.setId(rs.getInt("id"));
                tmp.setReleaseTime(rs.getString("releaseTime"));
                tmp.setTitle("Title");
                list.add(tmp);
            }
            JSONArray jobj = JSONArray.fromObject(list);
            return jobj.toString();
        }catch(SQLException e){
            System.out.println(e);
            return null;
        }
        
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        try(PrintWriter out = response.getWriter())
        {
         out.println(plan());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.write("please use doGet method.");
        }
    }
}

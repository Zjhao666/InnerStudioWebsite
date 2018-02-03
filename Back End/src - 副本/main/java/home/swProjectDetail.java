package home;

import beans.ConnectDatabase;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.Plan;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.sf.json.JSONArray;

public class swProjectDetail extends HttpServlet {

    public String ProjectDetail()
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select updateTime, content, state from Plan;";
            ResultSet rs = statement.executeQuery(sql);
            List<Plan> list = new ArrayList<>();
            while(rs.next())
            {
                Plan tmp = new Plan();
                tmp.setUpdateTime(rs.getString("updateTime"));
                tmp.setContent(rs.getString("content"));
                tmp.setState("state");
                list.add(tmp);
            }
            JSONArray jobj = JSONArray.fromObject(list);
            return jobj.toString();
        } catch (SQLException ex) {
            Logger.getLogger(swProjectDetail.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println(ProjectDetail());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doGet method.");
        }
    }


}

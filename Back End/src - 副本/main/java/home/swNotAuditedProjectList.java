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

public class swNotAuditedProjectList extends HttpServlet {

    public String NotAuditedProjectList()
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select * from Plan;";
            ResultSet rs = statement.executeQuery(sql);
            List<Plan> list = new ArrayList<>();
            while(rs.next())
            {
                String Captain = "select Member.id from Member, Plan where "+rs.getString("captain")+" = Member.realname;";
                ResultSet rsC = statement.executeQuery(Captain);
                String CaptainId = rsC.getString("id");
                Plan tmp = new Plan();
                tmp.setId(Integer.valueOf(CaptainId));
                tmp.setMember(rs.getString("member").split(","));
                tmp.setTitle(rs.getString("title"));
                tmp.setOverview(rs.getString("content"));
                tmp.setDocument(rs.getString("document"));
                list.add(tmp);
            }
            JSONArray jobj = JSONArray.fromObject(list);
            return jobj.toString();
        } catch (SQLException e) {
            System.err.println(e);
            return null;
        }
    }
    
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doPost method.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println(NotAuditedProjectList());
            out.println(200);
        }catch(IOException e)
        {
            PrintWriter out = response.getWriter();
            out.println(201);
            System.err.println(e);
        }
    }
}

package swRegisProject;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class swRPAvailableMembers extends HttpServlet {

    public String findNoUsedMember(){
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String Captain = "select captain from Plan;";
            ResultSet rs = statement.executeQuery(Captain);
            while(rs.next())
            {
                String captain = rs.getString("captain");
                String sql = "update Member set canBeUsed = 'false' where realname = '" + captain +"';";
                statement.execute(sql);
            }
            String Members = "select captain from Plan;";
            rs = statement.executeQuery(Members);
            while(rs.next())
            {
                String[] members = rs.getString("member").split(",");
                for(String member : members){
                    String sql = "update Member set canBeUsed = 'false' where realname = '" + member +"';";
                    statement.execute(sql);
                }
            }
            String free = "select id from Member where canBeUsed != 'false';";
            rs = statement.executeQuery(free);
            String Free = null;
            while(rs.next())
            {
                Free += rs.getString("id") + ",";
            }
            return Free.substring(0, Free.length()-1);
        }catch(SQLException e){
            System.err.println(e);
            return null;
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter()){
            out.println(findNoUsedMember());
        }catch(IOException e){
            System.err.println(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter()){
            out.println("please use doGet method.");
        }catch(IOException e){
            System.err.println(e);
        }
    }
}

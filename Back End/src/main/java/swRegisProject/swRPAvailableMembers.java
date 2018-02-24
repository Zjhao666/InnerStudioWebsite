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
import java.util.ArrayList;
import java.util.List;

public class swRPAvailableMembers extends HttpServlet {

    public List<String> findFreeMember(){
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            List<String> free = new ArrayList<>();
            String sql = "select id from Member where curProject is null";
            ResultSet rs = statement.executeQuery(sql);
            while(rs.next()){
                free.add(rs.getString("id").replaceFirst("^0*", ""));
            }
            return free;
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
            out.println(findFreeMember());
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

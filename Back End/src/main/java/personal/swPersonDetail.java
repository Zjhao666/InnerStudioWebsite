package personal;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import net.sf.json.JSONObject;

public class swPersonDetail extends HttpServlet {
    
    public String PrivatePage(int id)
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            JSONObject json = new JSONObject();
            String sql = "select id, nickname, achievements from Member where id = "+id+";";
            ResultSet rs = statement.executeQuery(sql);
            String nickname = rs.getString("nickname");
            String achievements = rs.getString("achievements");
            sql = "select capatain, member from Plan;";
            rs = statement.executeQuery(sql);
            String curProjectId = null;
            while(rs.next()){
                String cap = rs.getString("captain");
                String mem = rs.getString("member");
                String Id = String.valueOf(id);
                if(cap.equals(Id)||(mem.contains(Id))){
                    curProjectId = rs.getString("id");
                    break;
                }
            }
            json.put("id", id);
            json.put("nickname", nickname);
            json.put("curProjectId", curProjectId);
            json.put("achievements", achievements);
            return json.toString();
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
            out.println(PrivatePage(Integer.valueOf(request.getParameter("id"))));
        }catch(IOException e){
            System.err.println(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println("please doGet method.");
        }catch(IOException e){
            System.err.println(e);
        }
    }

}

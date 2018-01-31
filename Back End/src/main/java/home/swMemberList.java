package home;

import beans.Member;
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
import beans.Captain;

public class swMemberList extends HttpServlet {
    
    public String Member(HttpServletRequest request, HttpServletResponse response)
    {
        try
        {
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select id, nickname, isOline, pertag from Member;";
            List<Member> list = new ArrayList<>();
            ResultSet rs = statement.executeQuery(sql);
            while(rs.next())
            {
                Member tmp = new Member();
                tmp.setId(rs.getInt("id"));
                tmp.setNickname(rs.getString("nickname"));
                tmp.setIsOnline(rs.getString("isOline"));
                tmp.setPertag(rs.getString("pertag"));
                Captain i = new Captain();
                tmp.setIsCaptain(String.valueOf(i.isCaptain(rs.getString("realname"))));
                list.add(tmp);
            }
            JSONArray json = JSONArray.fromObject(list);
            return json.toString();
        }catch(SQLException e){
            System.out.println(e);
            return null;
        }
    }
    

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
         out.println(Member(request,response));
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

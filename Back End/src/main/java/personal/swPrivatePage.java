package personal;

import beans.Member;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;


public class swPrivatePage extends HttpServlet {
    static final String DRIVER = "com.mysql.jdbc.Driver";
    static final String URL = "jdbc:mysql://101.200.37.220:3306/InternalWebsite?characterEncoding=utf-8";
    static final String USER = "StudioWebsite";
    static final String PASSWORD = "Studio@user762";
    private Connection conn;
    
    public String PrivatePage(int id)
    {
        try{
            Class.forName(DRIVER);
            this.conn = DriverManager.getConnection(URL, USER, PASSWORD);
            Statement statement = conn.createStatement();
            String sql = "select id, realname, nickname, pertag from Member where id = "+ id +";";
            ResultSet rs = statement.executeQuery(sql);
            Member tmp = new Member();
            tmp.setAccount(rs.getString("account"));
            tmp.setId(rs.getInt("id"));
            tmp.setIsOnline(rs.getString("isOline"));
            tmp.setNickname(rs.getString("Nickname"));
            tmp.setRealname(rs.getString("realname"));
            tmp.setPertag(rs.getString("pertag"));
            tmp.setIsOnline(rs.getString("isOline"));
            JSONArray json = JSONArray.fromObject(tmp);
            return json.toString();
        }catch(ClassNotFoundException | SQLException e){
            System.out.println(e);
            return null;
        }
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try(PrintWriter out = response.getWriter())
        {
            out.println(PrivatePage(Integer.parseInt(request.getParameter("id"))));
            swMemberHeadImg s = new swMemberHeadImg();
            out.println(s.MemberHeading(Integer.parseInt(request.getParameter("id"))));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

}

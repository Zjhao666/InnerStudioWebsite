package personal;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class swMemberHeadImg extends HttpServlet {
    static final String DRIVER = "com.mysql.jdbc.Driver";
    static final String URL = "jdbc:mysql://101.200.37.220:3306/InternalWebsite?characterEncoding=utf-8";
    static final String USER = "StudioWebsite";
    static final String PASSWORD = "Studio@user762";
    private Connection conn;
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
    }

    public File MemberHeading(int id)
    {
        try{
            Class.forName(DRIVER);
            this.conn=DriverManager.getConnection(URL,USER,PASSWORD);
            Statement statement = conn.createStatement();
            String sql = "select id from Member where id = " + id +";";
            ResultSet rs = statement.executeQuery(sql);
            int account= rs.getInt("id");
            File file=new File("/usr/tomcat/webapps/InternalWebsite/picutres/"+account+".png");
            if(file.exists())
            {
                return file;
            }
            else
            {
                return null;
            }
        }catch(ClassNotFoundException | SQLException e){
        System.out.println(e);
        }
        return null;
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
        try(PrintWriter out = response.getWriter()){
            out.println(MemberHeading(Integer.parseInt((request.getParameter("id")))));
        }
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
        doGet(request, response);
    }

}

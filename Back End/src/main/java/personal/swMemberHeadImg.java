package personal;

import java.io.File;
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

public class swMemberHeadImg extends HttpServlet {

    public File MemberHeading(int id)
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select id from Member where id = " + id +";";
            ResultSet rs = statement.executeQuery(sql);
            int account= rs.getInt("id");
            File file=new File("/usr/StudioMemberPicture/"+account+".png");
            if(file.exists())
            {
                return file;
            }
            else
            {
                return null;
            }
        }catch(SQLException e){
        System.out.println(e);
        }
        return null;
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter()){
            File f = MemberHeading(Integer.parseInt((request.getParameter("id"))));
            if(f == null)
            {
                out.println("This id doesn't have a picture.");
            }else{
                out.println(f.toString());
            }
        }
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter()){
            out.println("please use doGet method.");
        }
    }

}

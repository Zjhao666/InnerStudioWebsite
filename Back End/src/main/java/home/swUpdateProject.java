package home;

import java.io.IOException;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import java.io.PrintWriter;
import beans.Captain;

public class swUpdateProject extends HttpServlet {
    
    
    
    public void update(int id, String c)
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            Date day=new Date();
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
            String day2 = df.format(day);
            Captain cc = new Captain();
            String realname = cc.findName(id);
            String sql = "update Plan set updateTime = '"+day2+"', content = '"+c+"', captain = '"+ realname + "' where id = "+ cc.findPlan(id)+";";
            statement.execute(sql);
        }catch(SQLException e){
        System.out.println(e);
        }
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doPost method.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            update(Integer.valueOf(request.getParameter("captainId")),request.getParameter("content"));
            out.println(200);
        }catch(IOException e)
        {
            PrintWriter out = response.getWriter();
            System.err.println(e);
            out.println(201);
        }
    }

}

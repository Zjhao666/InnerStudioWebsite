package login;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.ConnectDatabase;
import net.sf.json.JSONObject;


public class Login extends HttpServlet {


    public void AddCookie(String account, String pw, HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        boolean exist = false;
        Cookie[] cookies = request.getCookies();
        if(cookies == null)
        {
            return;
        }
        for(Cookie c : cookies)
        {
            if(c.getName().equals(account))
            {
                exist = true;
            }
        }
        if(exist == true){}
        else{
            Cookie cook = new Cookie(account, pw);
            cook.setMaxAge(24*60*60);
            response.addCookie(cook);
            try
            {
                ConnectDatabase C = new ConnectDatabase();
                Statement statement = C.conn.createStatement();
                String sql = "update Member set isOline = 'true' where account = '" + account +"';";
                statement.executeUpdate(sql);
                statement.close();
            }catch(SQLException e){
                System.err.println(e);
            }
        }
    }

    public int check(String account, String password, HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            ResultSet rs = statement.executeQuery("Select * from Member where account = '" + account +"';");
            String pw="";
            if(!rs.next()){
                return 201;
            }
            else
            {
                pw=rs.getString("password");
                if(!pw.equals(password))//incorrect password
               {
                    rs.close();
                    statement.close();
                    return 202;
               }
               else //correct password
               {
                    AddCookie(account, pw, request, response);
                    return 200;
               }
            }


        }catch(SQLException e){
            System.err.println(e);
            return 0;
        }

    }

    public boolean checkAdministrator(String account, String password, HttpServletRequest request, HttpServletResponse response){
        try
        {
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select * from Administrator where account = '" + account +"';";
            ResultSet rs = statement.executeQuery(sql);
            String pw="";
            if(rs.next()){
             pw=rs.getString("password");
            }
            rs.close();
            statement.close();
            return pw.equals("password");
        }catch(SQLException e)
        {
            System.err.println(e);
        }
        return false;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String account = request.getParameter("ac");
        String pw = request.getParameter("pw");
        JSONObject json = new JSONObject();
        json.put("statuscode", String.valueOf(check(account, pw, request, response)));
        json.put("admin", String.valueOf(checkAdministrator(account, pw, request,response)));
        try (PrintWriter writer = response.getWriter()) {
            writer.write(json.toString());
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.println("please use doGet method.");
        }catch(IOException e)
        {
            System.err.println(e);
        }
    }

    public void destroy(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException{
        String account = request.getParameter("ac");
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "update Member set isOline = 'false' where account = '" + account +"';";
            statement.executeUpdate(sql);
        }catch(SQLException e){
            System.err.println(e);
        }
    }

}

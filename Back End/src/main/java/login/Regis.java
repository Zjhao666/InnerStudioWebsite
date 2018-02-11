package login;

import beans.ConnectDatabase;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;

public class Regis extends HttpServlet {
    
    public int register(String account, String password, String realname, String nickname) 
            throws IOException
    {
        try
        {
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            ResultSet rs = statement.executeQuery("Select * from Member where account = '" + account +"';");
            if(rs.next())
            {
                return 201;
            }
            else{
                statement.execute("Insert into Member (account, password, realname, nickname) VALUES ('"+ account +"','"+password+"','"+realname+"','" + nickname+"');");
                return 200;
            }
        } catch(SQLException  e){
            System.out.println(e);
            return 202;
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try(PrintWriter out = response.getWriter())
        {
            out.write("please use doPost method.");
        }catch(Exception e)
        {
            System.out.println(e);
        }
    }

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        try (PrintWriter out = new PrintWriter(response.getOutputStream())) {
            String pw = request.getParameter("password");
            String realname = request.getParameter("realname");
            String nickname = request.getParameter("nickname");
            String account = request.getParameter("account");
            JSONObject json = new JSONObject();
            json.put("statuscode", String.valueOf(register(account,pw,realname,nickname)));
            out.println(json.toString());
        }catch(Exception e)
        {
            System.err.println(e);
        }
    }


}

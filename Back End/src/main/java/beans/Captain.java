package beans;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Captain {
    public boolean isCaptain(String realname)
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select captain from Plan where captain = '"+ realname +"';";
            ResultSet rs = statement.executeQuery(sql);
            return rs.next();
        } catch (SQLException e) {
            System.err.println(e);
            return false;
        }
    }
    
    public String findName(int id)
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select realname from Member where id = "+ id +";";
            ResultSet rs = statement.executeQuery(sql);
            return rs.getString("realname");
        } catch (SQLException e) {
            System.err.println(e);
            return null;
        }
    }
    
    public int findPlan(int id)
    {
        try{
            ConnectDatabase C = new ConnectDatabase();
            Statement statement = C.conn.createStatement();
            String sql = "select id from plan where captain = "+ this.findName(id) +";";
            ResultSet rs = statement.executeQuery(sql);
            return rs.getInt("id");
        } catch (SQLException e) {
            System.err.println(e);
        }
        return -1;
    }
}

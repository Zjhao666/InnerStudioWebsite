package beans;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectDatabase {
    static final String DRIVER = "com.mysql.jdbc.Driver";
    static final String URL = "jdbc:mysql://101.200.37.220:3306/InnerStudioWebsite?characterEncoding=utf-8";
    static final String USER = "root";
    static final String PASSWORD = "Luncert428";
    public Connection conn;
    
    public ConnectDatabase()
    {
        try
            {
                Class.forName(DRIVER);
                this.conn=DriverManager.getConnection(URL,USER,PASSWORD);
                System.out.println(conn.toString());
            }catch(ClassNotFoundException | SQLException e){
                System.err.println(e);
            }
    }
    
    public static void main(String args[]){
        ConnectDatabase c = new ConnectDatabase();
    }
}

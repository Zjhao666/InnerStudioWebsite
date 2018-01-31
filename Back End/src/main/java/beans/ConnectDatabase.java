package beans;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class ConnectDatabase {
    static final String DRIVER = "com.mysql.jdbc.Driver";
    static final String URL = "jdbc:mysql://101.200.37.220:3306/InternalWebsite?characterEncoding=utf-8";
    static final String USER = "StudioWebsite";
    static final String PASSWORD = "Studio@user762";
    public Connection conn;
    
    public ConnectDatabase()
    {
        try
            {
                Class.forName(DRIVER);
                this.conn=DriverManager.getConnection(URL,USER,PASSWORD);
            }catch(ClassNotFoundException | SQLException e){
                System.err.println(e);
            }
    }
}

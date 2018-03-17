
let mysql=require('mysql');
let pool=mysql.createPool({
  host:'101.200.37.220',
  user:'root',
  password:'Luncert428',
  database:'InnerStudioWebsite'
});



module.exports={
  query:(sql,callback)=>
    pool.getConnection((err,connection)=>
      connection.query(sql,(err,rows)=>{
        callback(err,rows);
        connection.release();
      })
    )
};

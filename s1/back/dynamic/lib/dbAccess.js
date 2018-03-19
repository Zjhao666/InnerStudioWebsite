
let mysql=require('mysql');
let pool=mysql.createPool({
  host:'47.94.218.249',
  user:'root',
  password:'luck778899..',
  database:'Site'
});

module.exports={
  execute:(sql,callback)=>
    pool.getConnection((err,connection)=>{
      if(!err) connection.query(sql,(err,rows)=>{
          callback(err,rows);
          connection.release();
        })
      else console.log(err);
    })
};

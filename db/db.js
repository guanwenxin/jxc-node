var mysql =require('mysql')

var pool = mysql.createPool({
    host:"static.guanwenxin.info",
    port:3306,
    user:'root',
    password:'123456',
    database:'jxcsql'
})

module.exports =  pool
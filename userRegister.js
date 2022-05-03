const { json } = require("express/lib/response");
const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mobigic"
});


function saveNewUser(userData) {
    console.log(JSON.stringify(userData));
    return new Promise(function(resolve, reject) {
        var sql = "INSERT INTO users (FName, LName, userName , password) VALUES ('" + userData.FName + "'" + ",'" + userData.LName + "','" + userData.username + "','" + userData.password + "'" + ")";
        console.log(sql);
        con.query(sql, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                console.log("userRegisterd Successfully");
                return resolve(result);
            }
        });
    });
}
// let data = "INSERT INTO users (FName, LName, userName , Password) VALUES ('" + userData.FName + "'" + ",'" + userData.LName + ",'" + userData.userName + "','" + userData.password + "'" + ")";
// console.log(data);


module.exports = {
    saveNewUser
}
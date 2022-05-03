const { json } = require("express/lib/response");
const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mobigic"
});


function saveFiles(fileName, uniqueCode, fileUrl) {
    return new Promise(function(resolve, reject) {
        var sql = "INSERT INTO files (fileName, uniqueCode ,fileUrl) VALUES ('" + fileName + "'," + uniqueCode + ",'" + fileUrl + "'" + ")";
        console.log(sql);
        con.query(sql, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                console.log("Saved File Successfully");
                return resolve(result);
            }
        });
    });
}

function savedFiles() {
    // console.log(JSON.stringify(userData));
    return new Promise(function(resolve, reject) {
        var sql = "SELECT * From files";
        console.log(sql);
        con.query(sql, function(err, result) {
            if (err) {
                return reject(err);
            } else {
                // console.log(" retrived datA Successfully", result);
                return resolve(result);
            }
        });
    });
}

function getFile(fileId) {
    return new Promise(function(resolve, reject) {
        var sql = "SELECT * From files Where id = " + fileId;
        console.log(sql);
        con.query(sql, function(err, result) {
            if (err) {
                return reject(err);
            };
            if (result.length > 0) {
                // console.log("id",)
                let res = JSON.parse(JSON.stringify(result));
                return resolve(res);
            }
        });
    });
}

function deleteFile(fileId) {
    return new Promise(function(resolve, reject) {
        var sql = "Delete From files Where id = " + fileId;
        console.log(sql);
        con.query(sql, function(err, result) {
            if (err) {
                return reject(err);
            };
            console.log("id", result)
            let res = JSON.parse(JSON.stringify(result));
            return resolve(res);
        });
    });
}
module.exports = {
    saveFiles,
    savedFiles,
    getFile,
    deleteFile
}
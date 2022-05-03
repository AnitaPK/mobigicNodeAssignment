const { json } = require("express/lib/response");
const mysql = require("mysql");


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mobigic"
});


function userLogin(request, response) {
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        con.query('SELECT * FROM users WHERE userName = ? AND password = ?', [username, password], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                response.render('FilesUploadDownload');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
}

module.exports = {
    userLogin
}
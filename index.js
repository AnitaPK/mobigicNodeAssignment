var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var path = require('path');
const { add } = require('nodemon/lib/rules');
const userRegister = require("./userRegister");
const userLogin = require("./userLogin");
const saveFiles = require("./saveFiles");
const fs = require('fs').promises;


app.get('/', function(req, res) {
    res.render('login.pug');
});

app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded


app.get('/register', async function(req, res) {
    res.render('userRegister');
});

app.post('/userRegister', async function(req, res) {
    userRegister.saveNewUser(req.body)
    res.render('login');
});


app.post('/login', async function(req, res) {
    userLogin.userLogin(req, res);
    // res.render('login');
});

app.get('/fileUpload', async function(req, res, next) {
    let savedFiles = await saveFiles.savedFiles();
    // console.log("Success, Image uploaded!", JSON.parse(JSON.stringify(savedFiles)))
    res.render("FilesUploadDownload", { savedFiles: JSON.parse(JSON.stringify(savedFiles)) });

    res.render('FilesUploadDownload');

});


let fileName;
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        fileName = file.originalname;
        cb(null, file.originalname)
    }
});


var upload = multer({ storage: storage }).single('imageupload')

app.post('/fileUpload', function(req, res) {
    upload(req, res, async function(err) {
        if (err) {
            res.send(err)
        } else {
            let fileUrl = `${__dirname}/public/uploads/` + fileName;
            let result = await saveFiles.saveFiles(fileName, req.body.uniqueCode, fileUrl);
            res.render("FilesUploadDownload");
        }
    });
});


app.get('/fileDownload', async function(req, res) {
    let savedFiles = await saveFiles.savedFiles();
    console.log("Success, Image uploaded!", JSON.parse(JSON.stringify(savedFiles)))
    res.render("downloadFiles", { savedFiles: JSON.parse(JSON.stringify(savedFiles)), alertmsg: "" });

});

app.post('/fileDownload', async function(req, res) {
    console.log("data=", req.body)
    let savedFiles = await saveFiles.savedFiles();
    let alertmsg = "Enter Valid Code";
    if (req.body.hasOwnProperty('Delete')) {
        console.log("its Delete")
        await fs.unlink(`${__dirname}/public/uploads/` + req.body.fileName);
        let resdata = await saveFiles.deleteFile(req.body.fileId)
        savedFiles = await saveFiles.savedFiles();
        res.render("downloadFiles", { savedFiles: JSON.parse(JSON.stringify(savedFiles)), alertmsg: "" });
    } else {
        let fileData = await saveFiles.getFile(req.body.fileId);
        if (fileData[0].uniqueCode == req.body.uniqueCode) {
            alertmsg = "";
            savedFiles = await saveFiles.savedFiles();
            res.download(`${__dirname}/public/uploads/` + req.body.fileName); // Set disposition and send it.
        } else {
            savedFiles = await saveFiles.savedFiles();
            res.render("downloadFiles", { savedFiles: JSON.parse(JSON.stringify(savedFiles)), alertmsg: alertmsg });
        }
    }
});

app.listen(3000);

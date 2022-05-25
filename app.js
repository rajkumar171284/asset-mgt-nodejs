const express = require('express');
// const mysql = require('mysql');
const createError = require('http-errors');

const app = express();
const cors=require('cors');
const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const assetRouter=require('./routes/assets.js');

var bodyParser = require('body-parser')
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(cors({
    origin: '*'
}));

// create application/json parser
// var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// create conn
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database:'asset-mgt',
//     port: 3000

// })

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('Mysql connected')

// })

// create db
// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE asset-mgt';
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         else
//             res.send('DB created')
//     })
// })
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/asset', assetRouter);
 
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.listen('3000', () => {
    console.log('server on 3000')
})



// app.get('/getAllUsersByCompanyID/:cid', (req, res) => {
//     const id = req.params.cid;
//     let sql = `SELECT * FROM user_tbl WHERE COMPANY_ID=${id}`;
//     db.query(sql, (err, result) => {
//         console.log(result)
//         if (err) throw err;
//         else
//             res.send({
//                 data:result,
//                 status:200
//             })
//     })
// })

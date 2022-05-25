const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// // 


router.post('/addAsset', (req, res) => {

    const sql = `INSERT INTO asset_tbl(PID, ASSET_NAME, ASSET_TYPE, INDUSTRIAL_TYPE, INDUSTRIAL_DATA_SOURCE, CONNECTION_TYPE, TRACKING_DEVICE, SENSOR, SENSOR_CATEGORY, SENSOR_DATA_TYPE, MAC_ADDRESS, COMPANY_ID, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,? , ? )`;
    const todo = ['', req.body.ASSET_NAME, req.body.ASSET_TYPE, req.body.INDUSTRIAL_TYPE, req.body.INDUSTRIAL_DATA_SOURCE, req.body.CONNECTION_TYPE, req.body.TRACKING_DEVICE, req.body.SENSOR, req.body.SENSOR_CATEGORY, req.body.SENSOR_DATA_TYPE, req.body.MAC_ADDRESS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date()];

    db.query(sql, todo, (err, result) => {
        console.log(result)
        if (err) {
            throw err;
            return res.status(400).send({
                msg: err
            });
        }
        else {
            res.send({
                data: result,
                status: 200,
                msg: 'Record added,successfully'
            })

        }
    })
})

router.get('/getAllAssets/:COMPANY_ID', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM asset_tbl WHERE COMPANY_ID=${COMPANY_ID}`;
    db.query(sql, (err, result) => {
        // console.log(result)
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})


module.exports = router;
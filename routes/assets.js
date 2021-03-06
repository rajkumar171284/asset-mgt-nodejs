const express = require('express');
const router = express.Router();
const db = require('./dbConnection');
// const { signupValidation, loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// // 


router.post('/addAssetConfig', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        // console.log('update')
        sql = 'UPDATE asset_config_tbl SET CONFIG_NAME=?, ASSET_ID=?, INDUSTRIAL_TYPE=?, INDUSTRIAL_DATA_SOURCE=?, CONNECTION_TYPE=?, TRACKING_DEVICE=?, SENSOR=?, SENSOR_CATEGORY=?, SENSOR_DATA_TYPE=?, MAC_ADDRESS=?, COMPANY_ID = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.CONFIG_NAME, req.body.ASSET_ID, req.body.INDUSTRIAL_TYPE, req.body.INDUSTRIAL_DATA_SOURCE, req.body.CONNECTION_TYPE, req.body.TRACKING_DEVICE, req.body.SENSOR, req.body.SENSOR_CATEGORY, req.body.SENSOR_DATA_TYPE, req.body.MAC_ADDRESS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated'
    } else {
        sql = `INSERT INTO asset_config_tbl(PID, CONFIG_NAME, ASSET_ID, INDUSTRIAL_TYPE, INDUSTRIAL_DATA_SOURCE, CONNECTION_TYPE, TRACKING_DEVICE, SENSOR, SENSOR_CATEGORY, SENSOR_DATA_TYPE, MAC_ADDRESS, COMPANY_ID, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,? , ? )`;
        todo = ['', req.body.CONFIG_NAME, req.body.ASSET_ID, req.body.INDUSTRIAL_TYPE, req.body.INDUSTRIAL_DATA_SOURCE, req.body.CONNECTION_TYPE, req.body.TRACKING_DEVICE, req.body.SENSOR, req.body.SENSOR_CATEGORY, req.body.SENSOR_DATA_TYPE, req.body.MAC_ADDRESS, req.body.COMPANY_ID, req.body.CREATED_BY, new Date()];
        errMessage = 'added'
    }
    db.query(sql, todo, (err, result) => {
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
                msg: `Record ${errMessage},successfully`
            })

        }
    })
})


router.get('/getAllAssetsConfig/:COMPANY_ID', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT asset_config_tbl.PID,asset_config_tbl.CONFIG_NAME,asset_config_tbl.ASSET_ID,asset_config_tbl.INDUSTRIAL_TYPE,asset_config_tbl.INDUSTRIAL_DATA_SOURCE,asset_config_tbl.CONNECTION_TYPE,asset_config_tbl.TRACKING_DEVICE,asset_config_tbl.SENSOR,asset_config_tbl.SENSOR_CATEGORY,asset_config_tbl.SENSOR_DATA_TYPE,asset_config_tbl.MAC_ADDRESS,asset_config_tbl.COMPANY_ID ,sensor_type_tbl.NAME,asset_tbl.NAME  FROM asset_config_tbl LEFT JOIN  sensor_type_tbl ON asset_config_tbl.SENSOR = sensor_type_tbl.PID LEFT JOIN asset_tbl ON asset_config_tbl.ASSET_ID=asset_tbl.PID`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

router.post('/deleteAssetConfig/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM asset_config_tbl WHERE PID=${PID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})
// connections starts
router.post('/addConnection', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        // console.log('update')
        sql = 'UPDATE asset_connection_type_tbl SET NAME = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.NAME, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'Record updated,successfully'
    } else {
        // console.log('add')
        // add new
        sql = `INSERT INTO asset_connection_type_tbl(PID, NAME, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?)`;
        todo = ['', req.body.NAME, req.body.CREATED_BY, new Date()];
        errMessage = 'Record added,successfully';

    }

    db.query(sql, todo, (err, result) => {
        // console.log(result)
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
                msg: errMessage
            })

        }
    })
})
router.get('/getAssetConnections', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM asset_connection_type_tbl`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
router.post('/deleteConnection/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM asset_connection_type_tbl WHERE PID=${PID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})

// sensor starts

router.get('/getAllSensors', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM sensor_type_tbl`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
router.post('/addSensor', (req, res) => {
    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        console.log('update')
        sql = 'UPDATE sensor_type_tbl SET NAME = ?, MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.NAME, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'Record updated,successfully'
        // sql =   `UPDATE sensor_type_tbl SET NAME = ${ req.body.NAME} WHERE PID = ${ req.body.PID}`;
    } else {
        console.log('add')
        // add new
        sql = `INSERT INTO sensor_type_tbl(PID, NAME, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?)`;
        todo = ['', req.body.NAME, req.body.CREATED_BY, new Date()];
        errMessage = 'Record added,successfully';

    }

    db.query(sql, todo, (err, result) => {
        // console.log(result)
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
                msg: errMessage
            })

        }
    })
})
router.post('/addSensorSubCatg', (req, res) => {

    const sql = `INSERT INTO sensor_subcategory_tbl(PID, SENSOR_TYPE_ID, CATEGORY_NAME, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?)`;
    const todo = ['', req.body.SENSOR_TYPE_ID, req.body.CATEGORY_NAME, req.body.CREATED_BY, new Date()];

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
router.get('/getSubCatgSensorByID/:SENSOR_TYPE_ID', (req, res) => {
    const SENSOR_TYPE_ID = req.params.SENSOR_TYPE_ID;
    let sql = `SELECT * FROM sensor_subcategory_tbl WHERE SENSOR_TYPE_ID=${SENSOR_TYPE_ID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})

// assets starts
router.get('/getAllAssets', (req, res) => {
    const COMPANY_ID = req.params.COMPANY_ID;
    let sql = `SELECT * FROM asset_tbl`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})
// add asset
router.post('/addAsset', (req, res) => {

    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update
        sql = 'UPDATE asset_tbl SET NAME = ?,ASSET_TYPE=?,COMPONENTS=?,MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.NAME, req.body.ASSET_TYPE, req.body.COMPONENTS, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = 'updated'
    } else {
        // add new
        sql = `INSERT INTO asset_tbl(PID, NAME,ASSET_TYPE,COMPONENTS, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?)`;
        todo = ['', req.body.NAME, req.body.ASSET_TYPE, req.body.COMPONENTS, req.body.CREATED_BY, new Date()];

        errMessage = ' added';

    }
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
                msg: `Record ${errMessage},successfully`
            })

        }
    })

})
router.post('/deleteAssetByID', (req, res) => {
    const PID = req.body.PID;

    let sql = `DELETE FROM asset_tbl WHERE PID=${PID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})
// chart request
router.post('/addChartRequest', (req, res) => {

    let sql;
    let todo;
    let errMessage;
    if (req.body.PID) {
        // update

        sql = 'UPDATE chart_request_tbl SET NAME = ?,CHART_TYPE=?,CHART_DATA=?,SQL_QUERY=?,IS_DRAGGED=?,MODIFY_BY =?,MODIFY_DATE=? WHERE PID=?';
        todo = [req.body.NAME, req.body.CHART_TYPE, req.body.CHART_DATA, req.body.SQL_QUERY, req.body.CREATED_BY, new Date(), req.body.PID];
        errMessage = ' updated'
    } else {
        // add new
        sql = `INSERT INTO chart_request_tbl(PID, NAME,CHART_TYPE,CHART_DATA,SQL_QUERY,IS_DRAGGED, CREATED_BY, CREATED_DATE) VALUES (?,?,?,?,?,?,?,?)`;
        todo = ['', req.body.NAME,req.body.CHART_TYPE, req.body.CHART_DATA, req.body.SQL_QUERY, req.body.IS_DRAGGED, req.body.CREATED_BY, new Date()];

        errMessage = ' added';

    }
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
                msg: `Record ${errMessage},successfully`
            })

        }
    })
})
// get all chart requests
router.get('/allChartRequest/:IS_DRAGGED', (req, res) => {
    //
    let sql = `SELECT * FROM chart_request_tbl WHERE IS_DRAGGED=?`;
    let todo = [req.params.IS_DRAGGED]
    db.query(sql, todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200
            })
    })
})


router.post('/chartRequestChangeStatus', (req, res) => {

    let sql = `UPDATE chart_request_tbl SET IS_DRAGGED=? WHERE PID=?`;
    const todo = [req.body.IS_DRAGGED, req.body.PID]
    db.query(sql,todo, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})
router.post('/deleteChartRequest/:PID', (req, res) => {
    const PID = req.params.PID;

    let sql = `DELETE FROM chart_request_tbl WHERE PID=${PID}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        else
            res.send({
                data: result,
                status: 200,
                msg: 'Record deleted.'
            })
    })
})

module.exports = router;
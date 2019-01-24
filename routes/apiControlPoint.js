// API Devices Functions
const express = require('express');
const router = express.Router();
const Joi = require('joi');  // Joi is a validator, making code smaller//
const checkAuth = require('../middleware/check-auth');

// Import Device Model

let DataSet = require('../models/dataset');

//GET Method for all Devices 

router.get('/', checkAuth, (req, res) => {
    DataSet.find({}, function(err, dataset){
        if(err){
            console.log(err)
        }else{
            //res.send(devices);
            res.json({
                dataset
            })
            console.log(dataset);
        }

    });
});

//GET params device :

router.get('/nick', checkAuth, (req, res) => {
    const company = req.query.id;
    const site = req.query.site;
    const device = req.query.device;

    res.send(company + site + device);
});

//GET Singel Dataset

router.get('/:id', (req, res) => {
    DataSet.findById(req.params.id, function(err, dataset){
        if(!dataset) return res.status(404).send('The Dataset with the given ID cannot be found!'), console.log('ID not found!')
            res.send(dataset);           
                
        });  
});



//POST to add device

router.post('/', checkAuth, (req, res) => {
    const {error} = validateDevice(req.body);

    if(error){
        res.status('404').send(error.details[0].message)
        console.log(error.details[0].message);
        return; 
    } 

    let device = new Device();
    device.pcname = req.body.pcname;
    device.ipaddress = req.body.ipaddress;
    device.macaddress = req.body.macaddress;
    device.status = req.body.status;
    device.timestamp = req.body.timestamp;
    device.deviceinfo = req.body.deviceinfo;
    device.winver = req.body.winver;
    device.ocslogfile = req.body.ocslogfile;


    device.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            res.send(device);
            console.log(device , ' Created 200');
        };

    });
});

//PUT Method update single device

router.put('/:id', checkAuth, (req, res) => {
    Device.findById(req.params.id, function(err, device){
        if(!device) return res.status('404').send('The device with the given ID cannot be found!'), console.log('ID not found!')

        //const {error} = validateDevice(req.body);

        //if(error) return res.status('404').send(error.details[0].message), console.log(error.details[0].message);

        device.pcname = req.body.pcname;
        device.ipaddress = req.body.ipaddress;
        device.macaddress = req.body.macaddress;

        device.deviceinfo = req.body.deviceinfo;
            device.windowsversion = req.body.windowsversion;
            device.cpu = req.body.cpu;
            device.availablememory = req.body.availablememory;
            device.exipaddress = req.body.exipaddress;
            device.antivirus = req.body.antivirus;
            device.deviceuptime = req.body.deviceuptime;
            device.lastupdated = req.body.lastupdated;

        device.devicestatus = req.body.devicestatus;
            device.cpu = req.body.cpu;
            device.memory = req.body.memory;
            device.network = req.body.network;

        device.harddrivespace = req.body.harddrivespace;
            device.totalspace = req.body.totalspace;
            device.freespace = req.body.freespace;
            device.usedspace = req.body.usedspace;
            
        device.ocslogfile = req.body.ocslogfile;         

        device.save();
        res.send(device);
        console.log(device, 'Updated 200!');
    });
});

//DEL Method Device

router.delete('/:id', checkAuth, (req, res) => {
    Device.findById(req.params.id, function(err, device){
        if(!device) return res.status(404).send('The device with the given ID cannot be found!'), console.log('ID not found!')

        device.remove(device._id);

        res.send(device + 'Delete 200');
        console.log(device, 'Delete 200 ');
    });
});

//POST Device check

router.post('/checkin', checkAuth, function(req, res){
    const {error} = validateDevice(req.body);

    if(error){
        res.status('404').send(error.details[0].message)
        console.log(error.details[0].message);
        return; 
    } 

    let device = new Device();
    device.pcname = req.body.pcname;
    device.ipaddress = req.body.ipaddress;
    device.macaddress = req.body.macaddress;
    device.status = req.body.status;
    device.timestamp = req.body.timestamp;


    device.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            res.send(device);
            console.log(device , ' Created 200');
        };

    });
});

//Validation 

function validateDevice(device){
    const schema ={
        pcname: Joi.string().min(3).required(),
        ipaddress: Joi.string().min(3).required(),
        macaddress: Joi.string().min(3).required(),
        status: Joi.string().min(3).required(),
        timestamp: Joi.string().min(3).required(),
    };

    return Joi.validate(device, schema);
} 

module.exports = router;
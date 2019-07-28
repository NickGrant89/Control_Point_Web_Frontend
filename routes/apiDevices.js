// API Devices Functions
const express = require('express');
const router = express.Router();
const Joi = require('joi');  // Joi is a validator, making code smaller//
const checkAuth = require('../middleware/check-auth');

// Import Device Model
let Device = require('../models/device');

//GET Method for all Devices 

router.get('/', checkAuth, (req, res) => {
    Device.find({}, function(err, devices){
        if(err){
            console.log(err)
        }else{
            //res.send(devices);
            res.json({
                devices
            })
            console.log(devices);
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

//GET Singel device :id

router.get('/:id', (req, res) => {
    Device.findById(req.params.id, function(err, device){
        if(!device) return res.status(404).send('The device with the given ID cannot be found!'), console.log('ID not found!')
            res.send(device);           
                
        });  
});

//GET device by :macaddress

router.get('/find/:macaddress', checkAuth, (req, res) => {
    const q = ({"macaddress": req.params.macaddress});
    Device.findOne(q, function(err, device){
        if(err)           
        return res.status(404).send('Not Found!'), console.log('ID not found!')
        if(device == null){
        return res.status(404).send('Not Found!'), console.log('ID not found!')
        }
        else{
            res.json({
                _id: device._id,
                
            });
        }
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
    device.controlpointDataset = req.body.controlpointDataset;
    device.timestamp = req.body.timestamp;
    device.controlpointClientVer = req.body.controlpointClientVer;
    device.controlpointServerVer = req.body.controlpointServerVer;
    device.kitchenServerVer = req.body.kitchenServerVer;
    device.kitchenBuilderVer = req.body.kitchenBuilderVer;
    device.reportViewerVer = req.body.reportViewerVer;
    device.dinetimeClientVer = req.body.dinetimeClientVer;
    device.dinetimeServerVer = req.body.dinetimeServerVer;

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

        
       
            
        device.kitchenlogfile = req.body.ocslogfile;         

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
        timestamp: Joi.string().min(3).required(),
    };

    return Joi.validate(device, schema);
} 

module.exports = router;
const express = require('express');
const router = express.Router();

//Access Control
const ensureAuthenticated = require('../middleware/login-auth');


let User = require('../models/user');

let DataSet = require('../models/dataset');


//GET Method to display devices on page.

router.get('/', ensureAuthenticated, function(req, res){
    DataSet.find({}, function(err, datasets){
    //if(err){res.redirect('/')}
    //console.log(devices)
    res.render('datasets', {
        title:'Devices',
        datasets:datasets,
    });
});
});


//Get single dataset page

router.get('/:id', ensureAuthenticated, (req, res) => {
    
    DataSet.findById(req.params.id, function(err, dataset){
        //console.log(dataset.settings.software);
        function hello(s) {
            var a = []; 
                for(var i = 0; i < s.length; i++) {
                    console.log(s[i]);
                    a.push(hello2(s[i])); 
                }
            return a;
        }
        function hello2(s1) {
            //console.log(s1);
            if(dataset.settings.software == null){return false};
            //console.log(dataset.settings.software.length);
                for(var i = 0; i < dataset.settings.software.length; i++) 
                    if(dataset.settings.software[i] == s1){
                    //console.log(dataset.settings.software[i]);
                        return 'true';
                    }
                    
                    
                    return false;
        } 
        if(dataset.primary ==undefined){
            dataset.primary = '';
        }
        const token = dataset.primary.split('.');
        
        var ip = token[0] + '.' + token[1] + '.' +token[2] + '.';
        //hello(dataset.settings.software);
        //console.log(dataset);
        //console.log(hello(dataset.settings.software));
        res.render('dataset', {
            dataset:dataset,
            devices:dataset.devices,
            cp:hello2('cp'),
            rv:hello2('rv'),
            kb:hello2('kb'),
            ks:hello2('ks'),
            gc:hello2('gc'),
            ar:hello2('ar'),
            ip:ip,
            subnetMask: dataset.subnetMask,
            defaultGateway: dataset.defaultGateway,
            primaryDns : dataset.primaryDns,
        });
        //console.log(device);
    });
});

//Get single device
router.get('/devices/:id/:id2', ensureAuthenticated, function(req, res){
    DataSet.findById(req.params.id2, function(err, relay){
        //console.log(req.params.id);
        if(err){return}
        var doc = relay.devices.id(req.params.id);
        //relay.devices.id(req.params.id).
            //console.log(doc);
   
        res.json(doc);
       
    });
});

//Edit single device
router.post('/devices/:id/:id2', ensureAuthenticated, function(req, res){
    //console.log(req.params)

    DataSet.findById(req.params.id2, function(err, dataset) {
        var subDoc = dataset.devices.id(req.params.id);
        subDoc.set(req.body);
      
        // Using a promise rather than a callback
        dataset.save().then(function(savedPost) {
          res.json('success');
        }).catch(function(err) {
          res.status(500).send(err);
        });
      });
    
});

// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator/check');

router.post('/dataset/add', ensureAuthenticated, [
    //Name
    check('dataSetName').isLength({min:3}).trim().withMessage('PC Name required'),

], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('danger', 'Please try again' ,{errors:errors.mapped()} );
    res.redirect('/');

   return { errors: errors.mapped() };
  }
  let device = new DataSet();
  device.dataSetName = req.body.dataSetName;
 

  device.save(function(err){
       if(err){
           console.log(err);
           return;
       }
       else{
           req.flash('success', 'Dataset Added')
           res.redirect('/')
       }
  });

});

router.post('/dataset/device/add/:id', ensureAuthenticated, [
    //Name
    check('deviceId').isLength({min:1}).trim().withMessage('PC Name required'),
    check('decription').isLength({min:1}).trim().withMessage('PC Name required'),
    check('deviceType').isLength({min:1}).trim().withMessage('PC Name required'),
    check('ipAddress').isLength({min:1}).trim().withMessage('PC Name required'),
    check('subnetMask').isLength({min:1}).trim().withMessage('PC Name required'),
    check('defaultGateway').isLength({min:1}).trim().withMessage('PC Name required'),
    check('primaryDns').isLength({min:1}).trim().withMessage('PC Name required'),

], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('danger', 'Please try again' ,{errors:errors.mapped()} );
    res.redirect('/');

   return { errors: errors.mapped() };
  }

  DataSet.findById(req.params.id, function(err, dataset){
  console.log(req.params.id)

// create a comment
dataset.devices.push({ 
    deviceId: req.body.deviceId, 
    decription: req.body.decription,
    deviceType: req.body.deviceType,
    ipAddress: req.body.ipAddress,
    subnetMask: req.body.subnetMask,
    defaultGateway: req.body.defaultGateway, 
    primaryDns: req.body.primaryDns,
});
var subdoc = dataset.devices[0];
//console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
subdoc.isNew; // true
let query = {_id:req.params.id}

  DataSet.update(query, dataset, function(err){
    if(err){
        console.log(err);
        
        return;
    }
    else{
        req.flash('success', 'Device Added')
        res.redirect('/controlpoint/'+req.params.id)
    }
});

});
});


//Add submit device with form
router.post('/dataset/edit/:id', ensureAuthenticated,  (req, res) => {
    let device = {};
    device.dataSetName = req.body.dataSetName;
    device.primary = req.body.primary;
    device.subnetMask = req.body.subnetMask;
    device.defaultGateway = req.body.defaultGateway;
    device.primaryDns = req.body.primaryDns;
    device.backup = req.body.backup;
    device.cpPrimary = req.body.cpPrimary;
  
    let query = {_id:req.params.id}

    DataSet.update(query, device, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
            req.flash('success', 'Dataset Updated')
            res.redirect('/controlpoint/'+req.params.id)
         }
    });
    console.log(req.body.pcname)
 });

 //Add submit device with form
router.post('/dataset/device/edit/:id', ensureAuthenticated,  (req, res) => {
    let device = {};
    device.dataSetName = req.body.dataSetName;
    device.primary = req.body.primary;
    device.backup = req.body.backup;
    evice.cpPrimary = req.body.cpPrimary;
  
    let query = {_id:req.params.id}

    DataSet.update(query, device, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
            req.flash('success', 'Devices Updated')
            res.redirect('/controlpoint/'+req.params.id)
         }
    });
    console.log('')
 });

 //Add submit device with form
router.post('/dataset/software/edit/:id', ensureAuthenticated,  (req, res) => {
     
    
    //console.log(req.body.software)
    var settings = {
        settings:{
            software: req.body.software,
        },
    }
  
    let query = {_id:req.params.id}
    //console.log(settings);
    DataSet.update(query, settings, function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            req.flash('success', 'Software List Updated')
            res.redirect('/controlpoint/'+req.params.id)
            
        }
    console.log(req.body.pcname)
 });
});

 //Delete edit form
router.delete('/device/:id/:id2', ensureAuthenticated, (req, res) => {
    /* if(!req.user._id){
        res.status(500).send();
    } */

    let query = {_id:req.params.id}

    DataSet.findById(req.params.id, function(err, dataset){
        /* if(device.owner != req.user._id){
            res.status(500).send();
        }else{ */
           
        //}


        // Equivalent to `parent.children.pull(_id)`
        dataset.devices.id(req.params.id2).remove();
        // Equivalent to `parent.child = null`
        dataset.devices.remove();
        dataset.save(function (err) {
        if (err) return handleError(err);
        res.redirect('/controlpoint/'+req.params.id)
        console.log('the subdocs were removed');
        });

    });
});

 //Delete edit form
 router.delete('/dataset/:id', ensureAuthenticated, (req, res) => {
    /* if(!req.user._id){
        res.status(500).send();
    } */

    let query = {_id:req.params.id}

    DataSet.findById(req.params.id, function(err, device){
        /* if(device.owner != req.user._id){
            res.status(500).send();
        }else{ */
            DataSet.deleteOne(query, function(err){
                if(err){
                    console.log(err)
                }
                res.send('Success');
            });
        //}
    });
});


module.exports = router;
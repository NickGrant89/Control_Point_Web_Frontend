const mongoose = require('mongoose');

// Sites schema


const DeviceCPSchema = mongoose.Schema({

    deviceId:{
        type: String
    },    
    decription:{
        type: String
    },
    deviceType:{
        type: String
    },
    ipAddress:{
        type: String
    },
    subnetMask:{
        type: String
    },    
    defaultGateway:{
        type: String
    },
    primaryDns:{
        type: String
    },
});


const DataSetSchema = mongoose.Schema({
    
    dataSetName:{
        type: String,
        required: false
    },
    primary:{
        type: String,
        required: false
    },
    backup:{
        type: String,
        required: false
    },
    cpPrimary:{
        type: String,
        required: false
    },
    subnetMask:{
        type: String
    },    
    defaultGateway:{
        type: String
    },
    primaryDns:{
        type: String
    },
    devices:[DeviceCPSchema],
    settings:{
        software:[String],
        logfile:[String],
    },
    
    
});


let DataSet = module.exports = mongoose.model('DataSet', DataSetSchema);
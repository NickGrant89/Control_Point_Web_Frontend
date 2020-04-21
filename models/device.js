let mongoose = require('mongoose');

let deviceSchema = mongoose.Schema({
    pcname:{
        type: String,
        required: true
    },
    ipaddress:{

        type: String,
        required: true
    },
    macaddress:{

        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required: false
    },
    controlpointDataset:{type:String},
    controlpointClientVer:{type:String},
    controlpointServerVer:{type:String},
    kitchenServerVer:{type:String},
    kitchenBuilderVer:{type:String},
    reportViewerVer:{type:String},
    dinetimeClientVer:{type:String},
    dinetimeServerVer:{type:String},
    software:[String],
    kitchenlogfile:[String],
});

let Device = module.exports = mongoose.model('device', deviceSchema);
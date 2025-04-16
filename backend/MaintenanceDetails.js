const mongoose = require('mongoose');

const MaintenanceRecordSchema = new mongoose.Schema({
    reference_no: {type:Number},
    maintenance_type: {type:String, enum:['Planned', 'Unplanned']},
    date_reported:Date,
    fault_type: [{type:String, enum:['Electrical', 'Plumbing', 'Carpentry', 'Masonry', 'External', 'Mechanical', ]}],
    maintenance_reason: String,
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo'}
})

const Maintenance = mongoose.model("MaintenanceRecord", MaintenanceRecordSchema);

mongoose.model.exports = Maintenance;
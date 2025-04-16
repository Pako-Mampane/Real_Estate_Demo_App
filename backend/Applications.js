const mongoose = require('mongoose');

const spouseSchema = new mongoose.Schema({
    forename: {type: String, required:true},
    lastname:{type: String, required:true},
    nationalty:{type: String, required:true},
    id_no:{type: String, required:true, unique:true},
    dob: {type:Date , required:true},
    place_of_Birth:{type: String, required:true},
    email:{type: String, required:true},
    employer_name:{type: String, required:true},
    place_of_work:{type: String, required:true},
    employer_address:{type: String, required:true},
    village:{type: String, required:true},
    ward:{type: String, required:true},
    District:{type: String, required:true},
    chief_headman_name:{type: String, required:true}
});

const directorsSchema = new mongoose.Schema({
    directors_name:{type:String, required:true},
    residence:{type:String, required:true},
    postal_address:{type:String, required:true},
    telephone:{type:String, required:true},
    cellphone:{type:String, required:true},
    share_no:{type:String, required:true}
});
const companySchema = new mongoose.Schema({
    company_name: {type: String, required:true},
    registration_no: {type:String, unique:true, required:true},
    physical_address:{type:String, required:true},
    postal_address:{type:String, required:true},
    company_number:{type:Number, required:true},
    contact_person:{type:String,required:true},
    contact_email:{type:String,required:true},
    contact_person_position:{type:String, required:true},
    directors:[directorsSchema]
});

const individualSchema = new mongoose.Schema({
    place_of_work:{type:String, required:true},
    occupation:{type:String, required:true},
    spouse_info:[spouseSchema],
});

const ApplicationsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' },
    applicant_type: {type:String, enum:['Individual', 'Company'], required:true},
    application_type:{type:String, enum:['Rental', 'Rent To Buy', 'Sale'], required:true},
    application_date:{type:Date, required:true},
    status:{type:String, enum:['Draft', 'Submitted', 'Approved', 'Refused']},
    attachments:[String],
    individual_info: [individualSchema],
    company_info:[companySchema]
});

const Applications = mongoose.model('Applications', ApplicationsSchema);
mongoose.model.exports = Applications;
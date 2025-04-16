const mongoose = require('mongoose');

const Property = new mongoose.Schema({
    propertyId: String,
    propertyType: {type:String, enum:['For Sale', 'For Rent', 'Under Development']},
    area:String,
    city:String,
    district:String,
    price: {type:Number},
    imageUrls: [String],
    plot_no : String
})

const Properties = mongoose.model("Properties", Property);
module.exports = Properties;
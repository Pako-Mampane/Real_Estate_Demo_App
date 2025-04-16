const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  dob: Date,
  postal_address: { type: String },
  omang_no: {
    type: Number,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v); // Regular expression to check for exactly 9 digits
      },
      message: props => `${props.value} is not a valid Omang number!`
    }
  },
  mobile_number: {
    type: Number,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{8}$/.test(v); // Regular expression to check for exactly 8 digits
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  next_of_kin_name: { type: String },
  net_of_kin_number: { type: String },
  marital_status: {
    type: String,
    enum: ['married', 'single', 'divorced', 'separated', 'widowed']
  },
  password: { type: String, required: true }
}, {
  collection: "UserInfo"
});

const UserInfo = mongoose.model("UserInfo", UserDetailsSchema);

module.exports = UserInfo;

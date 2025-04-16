const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();

// MongoDB connection
const mongoUrl = "mongodb+srv://bhcdevteam:qwertyuio@bhc-dev.osqv8kq.mongodb.net/?retryWrites=true&w=majority&appName=bhc-dev";
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Secret Key
const JWT_SECRET = "eetrytvrtghguhhvuinnpnibycezrtxwcvygfdgg1246tyft3858y8vrcj#$%&*(";

// Schema and Model
require('./UserDetails'); 
const User = mongoose.model("UserInfo");

require('./MaintenanceDetails'); 
const Maintenance = mongoose.model('MaintenanceRecord');

require('./Properties'); 
const Property = mongoose.model('Properties');

require('./Applications');
const Application = mongoose.model('Applications');
// API Routes
app.get('/', (req, res) => {
    res.send({ status: 'Server is running' });
});

// Register a new user
app.post('/register', async (req, res) => {
    const { username, firstname, lastname, omang_no, email, password } = req.body;
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        return res.send({ data: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({
            username: username,
            firstname: firstname,
            lastname: lastname,
            omang_no: omang_no,
            email: email,
            password: hashedPassword
        });
        res.send({ status: "ok", data: "User created" });
    } catch (error) {
        res.send({ status: "error", data: error.message });
    }
});

// Login user
app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    try {
        const oldUser = await User.findOne({ email: email });
        if (!oldUser) {
            return res.send({ data: "User not found" });
        }
        if (await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, JWT_SECRET);
            return res.send({ status: "ok", data: token });
        } else {
            return res.send({ status: "error", data: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: error.message });
    }
});

app.post("/userData", async(req,res)=>{
    const {token} = req.body;
    try{
        const user = jwt.verify(token, JWT_SECRET)
        const useremail = user.email;
        

        User.findOne({email:useremail}).then((data)=>{
            return res.send({status:"Ok", data:data});
        });

    } catch (error){
        return res.send({status:"error", data:error});
    }
});

// Fetch all properties
app.post("/insertProperties", async (req, res) => {
    const { property_type, area, district, price, imageUrls, plot_no } = req.body;
    // Basic input validation
    if (!property_type || !area || !district || !price || !imageUrls || !plot_no) {
        return res.status(400).send({ status: 'error', data: 'All fields are required' });
    }

    try {
        const newProperty = await Property.create({
            property_type,
            area,
            district,
            price,
            imageUrls,
            plot_no
        });
        res.status(201).send({ status: 'ok', data: 'Inserted!!', property: newProperty });
    } catch (error) {
        console.error('Error inserting property:', error);
        res.status(500).send({ status: 'error', data: 'Internal Server Error' });
    }
});
app.get('/properties', async (req, res) => {
    try {
        const properties = await Property.find().lean().exec(); // Using .lean() for plain JavaScript objects
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch and display specific property details
app.post('/displayProperty', async (req, res) => {
    const { propertyId } = req.body; // Assuming you want to fetch by propertyId
    try {
        const property = await Property.findOne({ propertyId }).lean().exec();
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json({ status: "ok", data: property });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create maintenance record
app.post("/createMaintenanceRecord", async (req, res) => {
    const { reference_no, maintenance_type, date_reported, fault_type, maintenance_reason } = req.body;
    try {
        await Maintenance.create({
            reference_no: reference_no,
            maintenance_type: maintenance_type,
            date_reported: date_reported,
            fault_type: fault_type,
            maintenance_reason: maintenance_reason,
        });
        res.send({ status: "ok", data: "Record created" });
    } catch (error) {
        res.status(500).json({ status: "error", data: error.message });
    }
});

//Create Application
app.post("/apply", async(req,res)=>{
    const {user,propertyId,applicant_type,application_type,application_date,status,attachments,individual_info, company_info }= req.body;
    try{
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send({ status: 'error', data: 'User is required' });
        }
        await Application.create({
            user:user,
            propertyId:propertyId,
            applicant_type:applicant_type,
            application_type:application_type,
            application_date:application_date,
            status:status,
            attachments:attachments,
            individual_info:individual_info,
            company_info:company_info
        })
        res.status(201).send({ status: 'ok', data: 'Inserted!!', property: newProperty });
    } catch (error) {
        console.error('Error inserting property:', error);
        res.status(500).send({ status: 'error', data: 'Internal Server Error' });
    }
})

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

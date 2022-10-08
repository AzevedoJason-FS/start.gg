const { application } = require("express");
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const cors = require('cors')

//Parsing middleware
app.use(express.urlencoded({
    extended: true
}));

//Middleware request all JSON
app.use(express.json());

//Middleware use cookies
app.use(cookieParser());

app.use('./uploads/', express.static('uploads'));

app.use(userRoutes);
app.use(uploadRoutes);

app.use(cors());

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
     });
    

//Middleware modules for Error Handling
app.use((req, res, next) => {
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
});

//Middleware modules to send Error neatly
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message, 
            status: error.status,
            method: req.method
        }
    });
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,    
},(err) => {
    if(err){
        console.error("Error: ", err.message);
    }
    else{
        console.log("MongoDB Connection Successful")
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})





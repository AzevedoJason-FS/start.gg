const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

//Parsing middleware
app.use(express.urlencoded({
    extended: true
}));

//Middleware request all JSON
app.use(express.json());

//middleware to handle CORS Policy
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method == "OPTIONS"){
        res.set('Access-Control-Max-Age');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
    }
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





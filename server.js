require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
require('./config/init')
const helper = require('./helpers/common')
const config = require('./config/keys');
const bodyParser = require('body-parser')
const fs = require('fs')

const PORT = parseInt(process.env.PORT)

    fs.truncate('logs/error.log', 0, function(){})   
    fs.truncate('logs/info.log', 0, function(){}) 
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json())
    process.env['LOCAL_IP']  = helper.getLocalIP()
    var corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200 
    }
    app.use(cors(corsOptions));
    mongoose.promise = global.Promise;
    var conn_url = process.env.MONGO_CONN_URL
    mongoose.connect(conn_url, config.MONGO_CONN_OPTIONS);
    const connection = mongoose.connection;
 
    connection.once('open', () => {
        const msg = 'MongoDB --  database connection established successfully!' 
        helper.prettyLog(msg) 
        helper.log2File(msg, 'info') 
        // helper.prettyLog(process.env['LOCAL_IP'])
        // require('./config/init')
    
    })
    connection.on('error', (err) => {
        // helper.prettyLog(err.message);
        // console.log(err.message);
        helper.log2File(err.message, 'error')
        setTimeout(() => {
            process.exit();
        }, 100);
    });

    app.use(passport.initialize());
    require("./middlewares/jwt")(passport);
    require('./routes/index')(app);

    app.listen(PORT, () => {
        helper.prettyLog(`Server running on http://localhost:${PORT}/`)
        helper.log2File(`Server running on http://localhost:${PORT}/`, 'info')
        
    })


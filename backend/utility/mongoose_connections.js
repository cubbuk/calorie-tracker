/*global require, module, process*/
"use strict";
(function () {
    const mongoose = require("mongoose");
    const config = require("./config.js");
    mongoose.Promise = require('bluebird');

    const mongoConnectionOptions = {
        db: {
            safe: true
        },
        server: {
            socketOptions: {keepAlive: 1}
        }
    };
    const mongooseConnection = mongoose.createConnection(config.MONGO_URL, mongoConnectionOptions);
    const mongooseConnections = {calorieTrackerDB: mongooseConnection};
    module.exports = mongooseConnections;
})();
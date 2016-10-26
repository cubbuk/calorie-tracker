"use strict";
const restify = require("restify");
const requestUtility = require("./requestUtility");
const server = restify.createServer({name: "calorie tracker backend"});
const mongoose = require("mongoose");

/*************CORS start*************/
server.use(restify.CORS({
    origins: ["http://localhost:63342", "http://localhost:8080", "http://localhost:8321"],   // defaults to ["*"]
    credentials: true,                 // defaults to false
    headers: ["X-Requested-With"]      // sets expose-headers
}));
server.on("MethodNotAllowed", requestUtility.unknownMethodHandler);
/************CORS end*************/
server.on("uncaughtException", requestUtility.uncaughtException);
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use((req, res, next) => {
    req.user = {username: "deneme", _id: mongoose.Types.ObjectId(), name: "Mehmet", surname: "Çubuk"};
    next();
});


var basePath = "api";
require("./routes/calorie_records_route")(basePath + "/calorie-records/", server);
require("./routes/users_route")(basePath + "/users/", server);

server.listen(8320, function () {
    console.log("at %s: %s listening at %s", module.filename, server.name, server.url);
});
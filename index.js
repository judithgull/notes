"use strict";

var http = require("http"),
    moment = require("moment"),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use("/notes", require('./routes/noteRoutes.js'));

http.createServer(app).listen(3000);

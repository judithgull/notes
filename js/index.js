"use strict";

var serveStatic = require("serve-static"),
    http = require("http"),
    finalhandler = require("finalhandler");

var serve = serveStatic("."),
    server = http.createServer(function (req, res) {
        var done = finalhandler(req, res);

        serve(req, res, done);
    });

server.listen(3000);

var storage = require('./noteStorage.js');
console.log(storage.getByCompletion(true));

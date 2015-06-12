"use strict";

var storage = require('./noteStorage.js'),
    serveStatic = require("serve-static"),
    url = require("url"),
    http = require("http"),
    finalhandler = require("finalhandler");

var serve = serveStatic("."),
    server = http.createServer(function (req, res) {
        var done = finalhandler(req, res);
        console.log(req.url);
        if(req.url.indexOf( "/notes" ) == 0){
            res.writeHead(200, {'Content-Type': 'application/json'});

            var queryObject = url.parse(req.url,true).query;
            var includeFinished = queryObject["includeFinished"];
            var sorting = queryObject["sorting"];
            var notes;
            if (sorting === "byCompletion"){
                notes = storage.getByCompletion(includeFinished);
            } else if (sorting === "byCreation"){
                notes = storage.getByCreation(includeFinished);
            } else if (sorting === "byImportance") {
                notes = storage.getByImportance(includeFinished);
            } else {

            }
            console.log(notes);
            res.end(JSON.stringify(notes));
        }else{
            serve(req, res, done);
        }
    });

server.listen(3000);

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
            var includeFinished = queryObject["includeFinished"] === "true";
            var sorting = queryObject["sorting"];
            var notes;
            if (sorting === "sort-by-completion") {
                notes = storage.getByCompletion(includeFinished);
            } else if (sorting === "sort-by-creation") {
                notes = storage.getByCreation(includeFinished);
            } else if (sorting === "sort-by-importance") {
                notes = storage.getByImportance(includeFinished);
            } else {

            }
            res.end(JSON.stringify(notes));
        }else{
            serve(req, res, done);
        }
    });

server.listen(3000);

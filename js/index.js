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

        if (req.method === "POST" && req.url === "/markNoteFinished") {
            var body = '';
            console.log(body);
            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                try {
                    var data = JSON.parse(body);
                    console.log(data);
                    if (typeof(data.id) != "undefined" && typeof(data.checked) != "undefined") {
                        storage.markFinished(data.id, data.checked);
                        return res.end("OK");
                    } else {
                        res.statusCode = 400;
                        return res.end('error: ' + err.message);
                    }

                } catch (err) {
                    res.statusCode = 400;
                    return res.end('error: ' + err.message);
                }
            });


        }
        else if (req.url.indexOf("/notes") == 0) {
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

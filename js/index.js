"use strict";

var storage = require('./noteStorage.js'),
    serveStatic = require("serve-static"),
    url = require("url"),
    http = require("http"),
    finalhandler = require("finalhandler"),
    moment = require("moment");


var serve = serveStatic("."),
    server = http.createServer(function (req, res) {
        var done = finalhandler(req, res);
        console.log(req.url);
        if (req.method === "POST"){
            var body = '';
            console.log(body);
            req.on('data', function (chunk) {
                body += chunk;
            });

            if (req.url === "/note") {
                req.on('end', function () {
                    var data = JSON.parse(body);
                    storage.addNote(
                        data.title,
                        data.description,
                        data.dueDate,
                        data.importance);
                });
            } else if (req.url === "/markNoteFinished") {
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
        } else if (req.method === "PUT") {
            console.log("PUT " + req.url);
            var body = '';
            console.log(body);
            req.on('data', function (chunk) {
                body += chunk;
            });
            if (req.url === "/note") {
                req.on('end', function () {
                    var data = JSON.parse(body);
                    storage.updateNote(
                        data.id,
                        data.title,
                        data.description,
                        data.dueDate,
                        data.importance,
                        data.completionDate);
                });
            }
        } else if (req.method === "GET") {
            console.log("get" + req.url);
            if (req.url.indexOf("/notes") == 0) {
                res.writeHead(200, {'Content-Type': 'application/json'});


                var queryObject = url.parse(req.url, true).query;
                var id = queryObject["id"];
                if (id) {
                    var note = storage.getNote(id);
                    res.end(JSON.stringify(note));

                } else {

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
                }
            }
            else {
                serve(req, res, done);
            }
        }
    });

server.listen(3000);

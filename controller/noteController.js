var store = require("../services/noteStorage.js"),
    url = require("url"),
    path = require('path');

module.exports.getNotes = function (req, res) {
    res.format({
        "text/html": function (req, res) {
            res.render("noteForm.hbs", {_method: "post"});
        },
        "application/json": function (req, res) {
            var queryObject = url.parse(req.url, true).query;

            var includeFinished = queryObject["includeFinished"] === "true";
            var sortOrder = queryObject["sorting"];

            store.getNotes(sortOrder, includeFinished, function callback(err, notes) {
                res.send(notes);
            });
        }
    });
};


module.exports.getNote = function (req, res) {
    store.getNote(req.params.id, function (err, note) {
        res.format({
            "text/html": function () {
                note._method = "put";
                res.render("noteForm.hbs", note);
            },
            "application/json": function () {
                res.send(note);
            }
        });
    });
};

module.exports.addNote = function (req, res) {
    res.format({
        'application/json': function () {

            var body = req.body;

            store.addNote(
                body.title,
                body.description,
                body.dueDate,
                body.importance,
                "",
                function (err, note) {
                    res.format({
                        'text/html': function () {
                            res.redirect("/");
                        },
                        'application/json': function () {
                            res.json(note);
                        }
                    });
                });
        }
    });

};


module.exports.updateNote = function (req, res) {
    var body = req.body;

    function callback(err, data) {
        res.format({
            'text/html': function () {
                res.send({});
            },
            'application/json': function () {
                res.send({});
            }
        });
    }

    if (isCompletionDateUpdate(body)) {
        store.updateCompletionDate(
            req.params.id,
            body.completionDate,
            callback);
    } else {

        if (!body.importance) {
            body.importance = 0;
        }

        store.updateNote(
            req.params.id,
            body.title,
            body.description,
            body.dueDate,
            body.importance,
            callback
        );
    }
};

function isCompletionDateUpdate(body) {
    if (body.hasOwnProperty("completionDate")) {
        return true;
    }
    return false;
}


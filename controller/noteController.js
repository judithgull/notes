var store = require("../services/noteStorage.js"),
    url = require("url"),
    path = require('path');

module.exports.getNotes = function (req, res) {
    var queryObject = url.parse(req.url, true).query;

    var includeFinished = queryObject["includeFinished"] === "true";
    var sortOrder = queryObject["sorting"];

    store.getNotes(sortOrder, includeFinished, function callback(err, notes) {
        res.format({
            'application/json': function () {
                res.send(notes);
            }
        });
    });
};


module.exports.getNote = function (req, res) {
    store.getNote(req.params.id, function (err, note) {
        res.format({
            "text/html": function () {
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
                res.redirect("/");
            },
            'application/json': function () {
                res.send({});
            }
        });
    }

    if (isFullNoteUpdate(body)) {
        store.updateNote(
            req.params.id,
            body.title,
            body.description,
            body.dueDate,
            body.importance,
            callback
        );
    } else {
        store.updateCompletionDate(
            req.params.id,
            body.completionDate,
            callback);
    }
};

function isFullNoteUpdate(body) {
    if (body.hasOwnProperty("title")
        && body.hasOwnProperty("description")
        && body.hasOwnProperty("dueDate")
        && body.hasOwnProperty("importance")) {
        return true;
    }
    return false;
}

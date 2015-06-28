var store = require("../services/noteStorage.js"),
    url = require("url");

module.exports.getNotes = function (req, res) {
    res.format({
        "text/html": function (req, res) {
            res.render("noteForm", {_method: "post"});
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
                res.render("noteForm", note);
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

            if (!body.importance) {
                body.importance = 0;
            }

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

    if (isCompletionDateUpdate(body)) {
        store.updateCompletionDate(
            req.params.id,
            body.completionDate,
            function () {
                res.send({});
            }
        );
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
            function () {
                res.redirect("/");
            }
        );
    }
};

function isCompletionDateUpdate(body) {
    return !!body.hasOwnProperty("completionDate");
}


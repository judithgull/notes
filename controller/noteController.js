var store = require("../services/noteStorage.js"),
    url = require("url");


module.exports.getNotes = function (req, res) {
    res.format({
        'application/json': function () {

            var queryObject = url.parse(req.url, true).query;

            var includeFinished = queryObject["includeFinished"] === "true";
            var sorting = queryObject["sorting"];

            function callback(err, notes){
                res.send(notes);
            }

            if (sorting === "sort-by-completion") {
                notes = store.getByCompletion(includeFinished, callback);
            } else if (sorting === "sort-by-creation") {
                notes = store.getByCreation(includeFinished, callback);
            } else if (sorting === "sort-by-importance") {
                notes = store.getByImportance(includeFinished, callback);
            } else {

            }

        }
    });

};


module.exports.getNote = function (req, res) {
    store.getNote(req.params.id, function (err, note) {
        res.format({
            'application/json': function () {
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
                body.importance, function (err, note) {
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
            'application/json': function () {
                res.send({});
            }
        });
    }

    if (body.hasOwnProperty("title")) {
        store.updateNote(
            req.params.id,
            body.title,
            body.description,
            body.dueDate,
            body.importance,
            body.completionDate,
            callback
        );
    } else {
        var isFinished = !(body.completionDate === "");
        store.markFinished(req.params.id, isFinished);
    }






};

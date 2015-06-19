var store = require("../services/noteStorage.js"),
    url = require("url");


module.exports.getNotes = function (req, res) {
    res.format({
        'application/json': function () {

            var queryObject = url.parse(req.url, true).query;

            var includeFinished = queryObject["includeFinished"] === "true";
            var sorting = queryObject["sorting"];
            var notes;
            if (sorting === "sort-by-completion") {
                notes = store.getByCompletion(includeFinished);
            } else if (sorting === "sort-by-creation") {
                notes = store.getByCreation(includeFinished);
            } else if (sorting === "sort-by-importance") {
                notes = store.getByImportance(includeFinished);
            } else {

            }
            res.send(notes);
        }
    });

};


module.exports.getNote = function (req, res) {
    res.format({
        'application/json': function () {
            var note = store.getNote(req.params.id);
            res.send(note);
        }
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
                body.importance);
        }
    });

};

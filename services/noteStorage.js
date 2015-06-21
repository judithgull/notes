var Datastore = require('nedb');
var db = new Datastore({filename: './data/notes.db', autoload: true});

function Note(title, description, dueDate, importance, completionDate) {
    this.title = String(title);
    this.description = String(description);
    this.creationDate = stringifyDate(new Date());
    this.dueDate = stringifyDate(dueDate);
    this.importance = Number(importance);

    if (arguments.length > 4) {
        this.completionDate = stringifyDate(completionDate);
    }
}

function stringifyDate(date) {
    return (date == null || date.length === 0) ? "" : JSON.stringify(new Date(date));
}

function publicGetNotes(sortOrderStr, includeFinished, callback) {
    var filter = includeFinished ? {} : {completionDate: ""};
    var sortObj = getSortOrder(sortOrderStr);

    db.find(filter).sort(sortObj).exec(function (err, notes) {
        if (callback) {
            callback(err, notes);
        }
    });
}

function getSortOrder(sortOrderStr) {
    if (sortOrderStr === "sort-by-completion") {
        return {completionDate: 1};
    } else if (sortOrderStr === "sort-by-creation") {
        return {creationDate: 1};
    } else if (sortOrderStr === "sort-by-importance") {
        return {importance: -1};
    } else {
        return {};
    }
}

function publicGetNote(id, callback) {
    db.findOne({_id: id}, function (err, note) {
        if (callback) {
            callback(err, note);
        }
    });
}

function publicAddNote(title, description, dueDate, importance, completionDate, callback) {
    var note = new Note(title, description, dueDate, importance, completionDate);

    db.insert(note, function (err, newNote) {
        if (callback) {
            callback(err, newNote);
        }
    });
}

function publicUpdateNote(id, title, description, dueDate, importance, callback) {
    var note = new Note(title, description, dueDate, importance);
    db.update({_id: id}, {$set: note}, {}, callback);
}

function publicUpdateCompletionDate(id, completionDate, callback) {
    db.update({_id: id}, {$set: {completionDate: stringifyDate(completionDate)}}, {}, callback);
}

module.exports = {
    /**
     * @param sortOrderStr
     * @param includeFinished
     * @param callback
     * */
    getNotes: publicGetNotes,
    /**
     * @param id
     * @param callback
     * */
    getNote: publicGetNote,
    /**
     * @param id
     * @param callback
     * */
    addNote: publicAddNote,
    /**
     * @param id
     * @param callback
     * */
    updateNote: publicUpdateNote,

    /**
     * @param id
     * @param completionDate
     * @param callback
     * */
    updateCompletionDate: publicUpdateCompletionDate
};
var Datastore = require('nedb');
var db = new Datastore({filename: './data/notes.db', autoload: true});

function Note(title, description, dueDate, importance, completionDate) {
    this.title = String(title);
    this.description = String(description);
    this.creationDate = stringifyDate(new Date());
    this.dueDate = stringifyDate(dueDate);
    this.importance = Number(importance);
    this.completionDate = stringifyDate(completionDate);

    function stringifyDate(date) {
        return (date == null || date.length === 0) ? "" : JSON.stringify(new Date(date));
    }
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

function publicMarkFinished(id, finished) {
    var note = publicGetNote(id);
    if (note && finished) {
        note.completionDate = new Date();
        privateUpdateNote(note);
    }
    else if (note) {
        note.completionDate = null;
        privateUpdateNote(note);
    }
    else {
        console.error("Note not found for id " + id);
    }
}

function privateUpdateNote(id, note, callback) {
    db.update({_id: id}, {$set: note}, {}, callback);
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

function publicUpdateNote(id, title, description, dueDate, importance, completionDate, callback) {
    var note = new Note(title, description, dueDate, importance, completionDate);
    return privateUpdateNote(id, note, callback);
}

module.exports = {
    /**
     * @param sortOrderStr
     * @param includeFinished
     * @param callback
     * */
    getNotes: publicGetNotes,
    addNote: publicAddNote,
    markFinished: publicMarkFinished, //Mark note with a given id as finished/unfinished
    getNote: publicGetNote,
    updateNote: publicUpdateNote
};



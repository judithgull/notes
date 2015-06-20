var moment = require("moment");
var sessionStorage = require("localStorage");
var Datastore = require('nedb');
var db = new Datastore({filename: './data/notes.db', autoload: true});

//only use de-CH formatted dates
moment.locale("de-CH");

function getNotes(callback) {
    db.find({}, function (err, notes) {
        if (callback) {
            callback(err, notes);
        }
    });
}

function Note(title, description, dueDate, importance, completionDate) {
    this.title = String(title);
    this.description = String(description);
    this.creationDate = new Date();
    this.dueDate = dueDate; //TODO Date()...
    this.importance = Number(importance);
    this.completionDate = completionDate;
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

function privateUpdateNote(note) {
    var notes = getNotes();
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === note.id) {
            notes[i] = note;
        }
    }
    sessionStorage.setItem("notes", JSON.stringify(notes));
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

function publicUpdateNote(id, title, description, dueDate, importance, completionDate) {
    var note = new Note(id, title, description, dueDate, importance, completionDate);
    return privateUpdateNote(note);
}

function publicGetByImportance(includeFinished, callback) {
    getSortedNotes(function (n1, n2) {
        return n2.importance - n1.importance;
    }, includeFinished, callback);
}


function publicGetByCreation(includeFinished, callback) {
    getSortedNotes(function (n1, n2) {
        return privateGetDatesDescSortOrder(n1.creationDate, n2.creationDate);
    }, includeFinished, callback);
}


function publicGetByCompletion(includeFinished, callback) {
    getSortedNotes(function (n1, n2) {
        return privateGetDatesDescSortOrder(n1.completionDate, n2.completionDate);
    }, includeFinished, callback);
}

function getSortedNotes(sortOrder, includeFinished, callback) {
    getNotes(function (err, notes) {
        if (!includeFinished) {
            notes = notes.filter(function (n) {
                return n.completionDate == null;
            });
        }
        notes = notes.sort(sortOrder);
        callback(err, notes);
    });
}


/**
 * Compares two dates: last date first, null values last.
 * */
function privateGetDatesDescSortOrder(date1, date2) {
    if (date1 === null && date2 === null) {
        return 0;
    }
    else if (date1 === null) {
        return 1;
    } else if (date2 === null) {
        return -1;
    }
    return moment(date2).valueOf() - moment(date1).valueOf();
}


module.exports = {
    addNote: publicAddNote,
    markFinished: publicMarkFinished, //Mark note with a given id as finished/unfinished
    getByCompletion: publicGetByCompletion,
    getByCreation: publicGetByCreation,
    getByImportance: publicGetByImportance,
    getNote: publicGetNote,
    updateNote: publicUpdateNote
};


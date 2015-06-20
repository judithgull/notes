var moment = require("moment");
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

function getNotes(callback) {
    db.find({}, function (err, notes) {
        if (notes.length === 0) {
            privateAddInitialNotes();
            getNotes(callback);
        } else if (callback) {
            callback(err, notes);
        }
    });
}

/*
 * Dummy data to show when page is initially loaded
 * */
function privateAddInitialNotes() {
    moment.locale("de-CH");
    publicAddNote(
        "CAS FEE Selbststudium",
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        moment().add(4, "day").toDate(),
        5,
        moment().subtract(5, "day").toDate().toDateString()
    );
    publicAddNote(
        "Einkaufen",
        "Eier\nButter",
        moment().toDate(),
        1,
        new Date().toDateString()
    );
    publicAddNote(
        "Mami anrufen",
        "888 888 88 88",
        null,
        0,
        ""
    );
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
                return n.completionDate === "";
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



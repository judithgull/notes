var notesStorage = (function () {
    //only use de-CH formatted dates
    moment.locale("de-CH");

    function getNotes() {
        var notesStr = sessionStorage.getItem("notes");
        if (!notesStr) {
            var emptyNotesStr = JSON.stringify([]);
            sessionStorage.setItem("notes", emptyNotesStr);
            privateAddInitialNotes();
        }
        return JSON.parse(sessionStorage.getItem("notes"));
    }

    /*
     * Dummy data to show when page is initially loaded
     * */
    function privateAddInitialNotes() {
        publicAddNote(
            "CAS FEE Selbststudium",
            "HTML für die Note App erstellen.\nCSS erstellen für die Note App.\nmore text",
            moment().add(4, "day").toDate(),
            5,
            moment().subtract(5, "day").toDate()
        );
        publicAddNote(
            "Einkaufen",
            "Eier\nButter",
            moment().toDate(),
            1,
            new Date()
        );
        publicAddNote(
            "Mami anrufen",
            "888 888 88 88",
            null,
            0,
            null
        );
    }

    function Note(title, description, dueDate, importance, completionDate) {
        this.id = getNotes().length;
        this.title = String(title);
        this.description = String(description);
        this.creationDate = new Date();
        this.dueDate = dueDate; //TODO Date()...
        this.importance = Number(importance);
        this.completionDate = completionDate;
    }

    function privateStoreNote(note) {
        var notes = getNotes();
        notes.push(note);
        sessionStorage.setItem("notes", JSON.stringify(notes));
    }

    function publicMarkFinished(id, finished) {
        var note = privateGetNote(id);
        if (note && finished) {
            note.completionDate = new Date();
        }
        else if (note) {
            note.copletionDate = null;
        }
        else {
            console.error("Note not found for id " + id);
        }
    }

    function privateGetNote(id) {
        var notes = getNotes();
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            if (note.id === id) {
                return note;
            }
        }
        return null;
    }

    function publicAddNote(title, description, dueDate, importance, completionDate) {
        var note = new Note(title, description, dueDate, importance, completionDate);
        privateStoreNote(note);
        console.log("New note added");
        console.log(note);
        return note;
    }

    function publicGetByImportance(includeFinished) {
        return getSortedNotes(function (n1, n2) {
            return n2.importance - n1.importance;
        }, includeFinished);
    }


    function publicGetByCreation(includeFinished) {
        return getSortedNotes(function (n1, n2) {
            return privateGetDatesDescSortOrder(n1.creationDate, n2.creationDate);
        }, includeFinished);
    }


    function publicGetByCompletion(includeFinished) {
        return getSortedNotes(function (n1, n2) {
            return privateGetDatesDescSortOrder(n1.completionDate, n2.completionDate);
        }, includeFinished);
    }

    function getSortedNotes(sortOrder, includeFinished) {
        var notes = getNotes();
        if (!includeFinished) {
            notes = notes.filter(function (n) {
                return n.completionDate == null;
            });
        }
        notes = notes.sort(sortOrder);
        return notes;
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

    return {
        addNote: publicAddNote,
        markFinished: publicMarkFinished, //Mark note with a given id as finished/unfinished
        getByCompletion: publicGetByCompletion,
        getByCreation: publicGetByCreation,
        getByImportance: publicGetByImportance
    };

}());
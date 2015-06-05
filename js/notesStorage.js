var notesStorage = (function () {



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

    function publicAddNote(title, description, dueDate, importance, completionDate) {
        var note = new Note(title, description, dueDate, importance, completionDate);
        privateStoreNote(note);
        console.log("New note added");
        console.log(note);
        return note;
    }

    return {
        addNote: publicAddNote,
        ensureInitialized: getNotes
    };

}());
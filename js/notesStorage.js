var notesStorage = (function () {

    function Note(title, description, dueDate, importance) {
        this.id = 0; //TODO
        this.title = String(title);
        this.description = String(description);
        this.creationDate = new Date();
        this.dueDate = dueDate; //TODO Date()...
        this.importance = Number(importance);
    }

    function privateStoreNote(note) {
        var notes = JSON.parse(sessionStorage.getItem("notes"));
        notes.push(note);
        sessionStorage.setItem("notes", JSON.stringify(notes));
    }

    function publicAddNote(title, description, dueDate, importance) {
        var note = new Note(title, description, dueDate, importance);
        privateStoreNote(note);
        console.log("New note added");
        console.log(note);
        return note;
    }

    return {
        addNote: publicAddNote
    };

}());
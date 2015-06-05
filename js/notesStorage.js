var notesStorage = (function () {
    var notes = JSON.parse(sessionStorage.getItem("notes"));

    function Note(title, description, dueDate, importance) {
        this.id = notes.length;
        this.title = String(title);
        this.description = String(description);
        this.creationDate = new Date();
        this.dueDate = dueDate; //TODO Date()...
        this.importance = Number(importance);
    }

    function privateStoreNote(note) {
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
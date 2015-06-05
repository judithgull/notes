var notesStorage = (function () {


    /* Makes sure that the local storage contains a notes array and adds some initial data, if no data is available.
     * */
    function publicEnsureInitialized() {
        var notesStr = sessionStorage.getItem("notes");
        var initialNotes;
        if (!notesStr) {
            initialNotes = JSON.stringify(privateGetInitialNotes());
            sessionStorage.setItem("notes", initialNotes);
            console.log("Initialized Store:", initialNotes);
        }
    }


    /*
     * Dummy data to show when page is initially loaded
     * */
    function privateGetInitialNotes() {
        return [
            {
                id: 0,
                title: "CAS FEE Selbststudium",
                description: "HTML für die Note App erstellen.\nCSS erstellen für die Note App.\nmore text",
                creationDate: moment().subtract(4, "day").toDate(),
                dueDate: moment().add(4, "day").toDate(),
                completionDate: moment().subtract(5, "day").toDate(),
                importance: 5
            },
            {
                id: 1,
                title: "Einkaufen",
                description: "Eier\nButter",
                creationDate: moment().subtract(10, "day").toDate(),
                dueDate: moment().toDate(),
                completionDate: new Date(),
                importance: 1
            },
            {
                id: 2,
                title: "Mami anrufen",
                description: "888 888 88 88",
                creationDate: moment().toDate(),
                dueDate: null,
                completionDate: null,
                importance: 0
            }
        ];
    }

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
        addNote: publicAddNote,
        ensureInitialized: publicEnsureInitialized
    };

}());
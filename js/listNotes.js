"use strict";
$(function () {
    ensureStorageInitialized();

    var notesStr = sessionStorage.getItem("notes");
    var notes = JSON.parse(notesStr);

    console.log("Current notes in session store:");
    console.log(notes);
});

/* Makes sure that the local storage contains a notes array and adds some initial data, if no data is available.
* */
function ensureStorageInitialized(){
    var notesStr = sessionStorage.getItem("notes");
    var initialNotes;
    if (!notesStr) {
        initialNotes = JSON.stringify(getInitialNotes());
        console.log(initialNotes);
        sessionStorage.setItem("notes", JSON.stringify(initialNotes));
        console.log("Initialized Store:",initialNotes);
    }
}

/*
 * Dummy data to show when page is initially loaded
 * */
function getInitialNotes() {
    return [
        {
            title: "CAS FEE Selbststudium",
            description: "HTML für die Note App erstellen.\\nCSS erstellen für die Note App.\\nmore text",
            dueDate: new Date() + 2,
            completionDate: new Date(),
            importance: 2
        },
        {
            title: "Einkaufen",
            description: "Eier\\nButter",
            dueDate: new Date(),
            completionDate: null,
            importance: 1
        },
        {
            title: "Mami anrufen",
            description: "888 888 88 88",
            dueDate: null,
            completionDate: null,
            importance: 0
        }
    ];
}



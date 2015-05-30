"use strict";
$(function () {
    console.log("hello!");
    console.log(getInitialNotes());

    var notesStr = sessionStorage.getItem("notes");
    if (!notesStr) {
        sessionStorage.setItem("notes", JSON.stringify([]));
        notesStr = sessionStorage.getItem("notes");
    }
    var notes = JSON.parse(notesStr);

    //add notes to page
    //document.getElementById("body").appendChild("div")

    console.log("Current notes in session store:");
    console.log(notes);

});

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



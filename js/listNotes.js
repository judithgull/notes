"use strict";
$(function () {
    ensureStorageInitialized();

    var notesStr = sessionStorage.getItem("notes");
    var notes = JSON.parse(notesStr);
    console.log("Current notes in session store:", notes);

    moment.locale("de-CH"); //TODO use browser locale
    Handlebars.registerHelper("formatDate", formatDate);
    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);

});

function formatDate(dateStr) {
    if (!dateStr) {
        return "Irgendwann";
    }
    else {
        var m = moment(dateStr, "YYYY-MM-DD");
        if (m.day() === moment().day() && m.month() === moment().month() && m.year() === moment().year()) {
            return "Heute";
        }
        return moment(dateStr, "YYYY-MM-DD").fromNow();
    }
}

/* Makes sure that the local storage contains a notes array and adds some initial data, if no data is available.
* */
function ensureStorageInitialized(){
    var notesStr = sessionStorage.getItem("notes");
    var initialNotes;
    if (!notesStr) {
        initialNotes = JSON.stringify(getInitialNotes());
        sessionStorage.setItem("notes", initialNotes);
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
            description: "HTML für die Note App erstellen.\nCSS erstellen für die Note App.\nmore text",
            dueDate: moment().add(4, "day").format("YYYY-MM-DD"),
            completionDate: new Date(),
            importance: 2
        },
        {
            title: "Einkaufen",
            description: "Eier\nButter",
            dueDate: moment().format("YYYY-MM-DD"),
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



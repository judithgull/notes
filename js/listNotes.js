"use strict";
$(function () {
    ensureStorageInitialized();

    var notesStr = sessionStorage.getItem("notes");
    var notes = JSON.parse(notesStr);
    console.log("Current notes in session store:", notes);

    Handlebars.registerHelper('repeat', function (n, block) {
        var res = "";
        for (var i = 0; i < n; ++i)
            res += block.fn(i);
        return res;
    });

    moment.locale("de-CH"); //TODO use browser locale
    Handlebars.registerHelper("formatDate", formatDate);
    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);
});

function formatDate(datetime) {
    var isToday = function (mom) {
        return mom.day() === moment().day()
            && mom.month() === moment().month()
            && mom.year() === moment().year();
    };

    if (!datetime) {
        return "Irgendwann";
    }
    var m = moment(datetime);
    if (isToday(m)) {
        return "Heute";
    }
    return m.fromNow();
}

/* Makes sure that the local storage contains a notes array and adds some initial data, if no data is available.
 * */
function ensureStorageInitialized() {
    var notesStr = sessionStorage.getItem("notes");
    var initialNotes;
    if (!notesStr) {
        initialNotes = JSON.stringify(getInitialNotes());
        sessionStorage.setItem("notes", initialNotes);
        console.log("Initialized Store:", initialNotes);
    }
}

/*
 * Dummy data to show when page is initially loaded
 * */
function getInitialNotes() {
    return [
        {
            id: 0,
            title: "CAS FEE Selbststudium",
            description: "HTML für die Note App erstellen.\nCSS erstellen für die Note App.\nmore text",
            dueDate: moment().add(4, "day").toDate(),
            completionDate: new Date(),
            importance: 2
        },
        {
            id: 1,
            title: "Einkaufen",
            description: "Eier\nButter",
            dueDate: moment().toDate(),
            completionDate: null,
            importance: 1
        },
        {
            id: 2,
            title: "Mami anrufen",
            description: "888 888 88 88",
            dueDate: null,
            completionDate: null,
            importance: 0
        }
    ];
}



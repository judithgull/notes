"use strict";
$(function () {
    ensureStorageInitialized();

    var notesStr = sessionStorage.getItem("notes");
    var notes = JSON.parse(notesStr);
    console.log("Current notes in session store:", notes);
    moment.locale("de-CH"); //TODO use browser locale

    registerHandlebarsHelpers();
    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    $("#sort-tabs").on("click", function () {
        function activateOnly(id, activeMarker) {
            $("." + activeMarker).toggleClass(activeMarker);
            $("#" + id).toggleClass(activeMarker);
        }

        var selectedId = event.toElement.id;
        activateOnly(selectedId, "tab-item--active");

        var sortOrder = getSortOrder(selectedId);
        setNotesHtml(notes.sort(sortOrder));

    });
    setNotesHtml(notes);

    /**
     * Applies the notes data to the template and sets the generated HTML to the notes list.
     * */
    function setNotesHtml(notes) {
        document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);
    }
});

/**
 * Returns a sort comparator function for a given id.
 * */
function getSortOrder(id) {
    switch (id) {
        case "sort-by-completion":
            return function (n1, n2) {
                return compareDatesDesc(n1.completionDate, n2.completionDate);
            };
        case "sort-by-creation":
            return function (n1, n2) {
                return compareDatesDesc(n1.creationDate, n2.creationDate);
            };
        case "sort-by-importance":
            return function (n1, n2) {
                return n2.importance - n1.importance;
            };
    }
}

/**
 * Compares two dates: last date first, null values last.
 * */
function compareDatesDesc(date1, date2) {
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

/**
 * Helper functions for templating:
 * repeat(n,block): repeat a block n times
 * formatDate(date): display a date nicely
 */
function registerHandlebarsHelpers() {
    Handlebars.registerHelper('repeat', function (n, block) {
        var res = "";
        for (var i = 0; i < n; ++i)
            res += block.fn(i);
        return res;
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

    Handlebars.registerHelper("formatDate", formatDate);
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
            creationDate: moment().subtract(4, "day").toDate(),
            dueDate: moment().add(4, "day").toDate(),
            completionDate: moment().subtract(5, "day").toDate(),
            importance: 2
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



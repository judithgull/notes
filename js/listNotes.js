"use strict";
$(function () {
    notesStorage.ensureInitialized();

    var notesStr = sessionStorage.getItem("notes");
    var notes = JSON.parse(notesStr);
    console.log("Current notes in session store:", notes);
    moment.locale("de-CH"); //TODO use browser locale

    registerHandlebarsHelpers();
    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    $("#sort-tabs").on("click", function () {
        function activateOnly(id, activeMarker) {
            $("." + activeMarker).toggleClass(activeMarker);
            $("#" + id).parent().toggleClass(activeMarker);
        }

        var selectedId = event.toElement.id;
        activateOnly(selectedId, "tab-item--active");

        var notes = getOrderedNotes(selectedId);
        setNotesHtml(notes);

    });
    setNotesHtml(notes);

    /**
     * Applies the notes data to the template and sets the generated HTML to the notes list.
     * */
    function setNotesHtml(notes) {
        document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);
    }
});

function getOrderedNotes(id) {
    switch (id) {
        case "sort-by-completion":
            return notesStorage.getByCompletion();
        case "sort-by-creation":
            return notesStorage.getByCreation();
        case "sort-by-importance":
            return notesStorage.getByImportance();
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


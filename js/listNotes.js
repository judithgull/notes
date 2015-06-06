"use strict";
$(function () {
    registerHandlebarsHelpers();
    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    reloadNotes();

    /**
     * Register Click-Handler on Sort Tabs
     * */
    $("#sort-tabs").on("click", function () {
        var selectedId = event.toElement.id;
        activateTab(selectedId);
        reloadNotes();
    });

    function activateTab(id) {
        var activeMarker = "tab-item--active";
        $("." + activeMarker).toggleClass(activeMarker);
        $("#" + id).parent().toggleClass(activeMarker);
    }

    /**
     * Register Click-Handler on Finished Button
     */
    $("#show-finished-btn").on("click", function () {
        $("#show-finished-btn").toggleClass("btn--active");
    });

    /**
     * Load the notes in the correct order and set the html to the page
     * */
    function reloadNotes() {
        var sortOrderId = $(".tab-item--active").children().first().attr("id");
        var notes = getOrderedNotes(sortOrderId);
        document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);

        /**
         * Register Handler for finished checkboxes
         */
        var notesCheckboxes = $("#js-notes-list").find("[type=\"checkbox\"]");
        notesCheckboxes.on("click", function () {
            var checkbox = $("#" + this.id);
            var isChecked = checkbox.prop("checked");
            var noteid = checkbox.parents("li").attr("data-id");
            console.log("Checking note " + noteid + " " + isChecked);
        });

    }


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

});

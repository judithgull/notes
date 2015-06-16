"use strict";
$(function () {
    moment.locale("en-US");
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
        reloadNotes();
    });


    /**
     * Load the notes in the correct order and set the html to the page
     * */
    function reloadNotes() {
        var sortOrderId = $(".tab-item--active").children().first().attr("id");
        var isShowFinished = Boolean($(".btn--active").length);

        var getNotesUrl = "/notes?sorting=" + sortOrderId + "&includeFinished=" + isShowFinished;

        $.getJSON(getNotesUrl, function (notes) {
            document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);

            /**
             * Register Handler for finished checkboxes
             */
            var notesCheckboxes = $("#js-notes-list").find("[type=\"checkbox\"]");
            notesCheckboxes.on("click", function () {
                var checkbox = $("#" + this.id);
                var isChecked = checkbox.prop("checked") ? true : false;
                var id = Number(checkbox.parents("li").attr("data-id"));
                $.post("/markNoteFinished", JSON.stringify({id: id, checked: isChecked}),
                    function () {
                        reloadNotes();
                    });
            });

            /**
             * Register Handler on Edit Button
             * */
            var editButtons = $("#js-notes-list").find("button");
            editButtons.on("click", function () {
                var id = Number($("#" + this.id).parents("li").attr("data-id"));
                location.href = "note.html?id=" + id;
            });
        });

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
                return "someday";
            }

            var m = moment(datetime);
            if (isToday(m)) {
                return "today";
            }
            return m.fromNow();
        }

        Handlebars.registerHelper("formatDate", formatDate);
    }

});

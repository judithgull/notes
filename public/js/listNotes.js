;
$(function () {
    "use strict";

    var showFinishedBtn = $("#show-finished-btn");

    //load initial query settings
    activateSortTab(notesSettings.getSortOrder());
    activateFinishedButton(notesSettings.isIncludeFinished());

    Handlebars.registerHelper('repeat', handlebarUtils.repeat);
    Handlebars.registerHelper("formatDate", handlebarUtils.formatDate);

    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    reloadNotes();

    pollingObserver.addChangeListener(function (insertedNotes, updatedNotes, removedNotes) {
        if (removedNotes.length > 0) {
            removeNotes(removedNotes);
        }
        if (insertedNotes.length > 0) {
            insertNotes(insertedNotes);
        }
        if (updatedNotes.length > 0) {
            updateNotes(updatedNotes)
        }
    });


    function activateFinishedButton(showFinished) {
        if (showFinished !== showFinishedBtn.hasClass("btn--active")) {
            showFinishedBtn.toggleClass("btn--active");
        }
    }

    /**
     * Register Click-Handler on Finished Button
     */
    showFinishedBtn.on("click", function () {
        notesSettings.toggleIncludeFinished();
        activateFinishedButton(notesSettings.isIncludeFinished());
        reloadNotes();
    });

    function activateSortTab(id) {
        var activeMarker = "tab-item--active";
        $("." + activeMarker).toggleClass(activeMarker);
        $("#" + id).parent().toggleClass(activeMarker);
    }

    /**
     * Register Click-Handler on Sort Tabs
     * */
    $("#sort-tabs").on("click", function () {
        var selectedId = event.toElement.id;
        notesSettings.setSortOrder(selectedId);
        activateSortTab(selectedId);
        reloadNotes();
    });

    function insertNotes(notes) {
        for (var i = 0; i < notes.length; i++) {
            var newNote = notes[i];
            var notesHtml = createNotesHtml([newNote]);
            if (newNote.previousId) {
                var previousElem = $("#note-" + newNote.previousId);
                $(notesHtml).insertAfter(previousElem);
            } else {
                $("#js-notes-list").prepend(notesHtml);
            }

            var elem = $("#note-" + newNote._id);
            addFinishedClickHandler(elem);
            addEditClickHandler(elem);
            addShowMoreHandlers(elem);

        }
    }

    function updateNotes(notes) {
        for (var i = 0; i < notes.length; i++) {
            var newNote = notes[i];
            var notesHtml = createNotesHtml([newNote]);
            var element = $("#note-" + newNote._id);
            element.replaceWith(notesHtml);
        }
    }

    function removeNotes(notes) {
        for (var i = 0; i < notes.length; i++) {
            var id = notes[i]._id;
            $("#note-" + id).remove();
        }
    }

    function reloadNotes() {
        console.log("reload");
        pollingObserver.reloadAll(replaceAllNotes);
    }


    /**
     * Load the notes in the correct order and set the html to the page
     * */
    function replaceAllNotes(notes) {

        document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);

        var notesList = $("#js-notes-list");
        addFinishedClickHandler(notesList);
        addEditClickHandler(notesList);
        addShowMoreHandlers(notesList);

    }

    function addShowMoreHandlers(searchRoot) {
        var showChar = 200;
        var ellipsestext = "...";
        var moretext = "more";
        var lesstext = "less";

        searchRoot.find($('.more')).each(function () {
            var content = $(this).html();
            if (content.length > showChar) {
                var c = content.substr(0, showChar);
                var h = content.substr(showChar - 1, content.length - showChar);
                var html = c + '<span class="moreellipses">' + ellipsestext + ' </span><span class="morecontent"><span>' + h + '</span>  <a href="" class="morelink t-link">' + moretext + '</a></span>';
                $(this).html(html);
            }
        });

        searchRoot.find($(".morelink")).click(function () {
            if ($(this).hasClass("less")) {
                $(this).removeClass("less");
                $(this).html(moretext);
            } else {
                $(this).addClass("less");
                $(this).html(lesstext);
            }
            $(this).parent().prev().toggle();
            $(this).prev().toggle();
            return false;
        });
    }

    function addEditClickHandler(searchRoot) {
        var editButtons = searchRoot.find("button");
        editButtons.on("click", function () {
            var id = $("#" + this.id).parents("li").attr("data-id");
            location.href = "notes/" + id;
        });
    }

    function addFinishedClickHandler(searchRoot) {

        var notesCheckboxes = searchRoot.find("[type=\"checkbox\"]");

        notesCheckboxes.on("click", function () {

            var checkbox = $("#" + this.id);
            var isChecked = checkbox.prop("checked") ? true : false;
            var id = checkbox.parents("li").attr("data-id");

            var completionDate = (isChecked) ? new Date() : null;

            restClient.updateCompletionDate(id, completionDate, reloadNotes);
        });
    }
});

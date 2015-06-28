;
$(function () {
    "use strict";

    var showFinishedBtn = $("#show-finished-btn");

    //load initial query settings
    activateSortTab(notesSettings.getSortOrder());
    activateFinishedButton(notesSettings.isIncludeFinished());

    Handlebars.registerHelper('repeat', handlebarUtils.repeat);
    Handlebars.registerHelper("formatDate", handlebarUtils.formatDate);
    Handlebars.registerHelper("formatFinishedText", handlebarUtils.formatFinishedText);
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
    $("#sort-tabs").children().on("click", function () {
        var selectedId = $(this).find("a").attr("id");
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
            addClickHandlers(elem);
        }
    }

    function updateNotes(notes) {
        for (var i = 0; i < notes.length; i++) {
            var updatedFields = notes[i];

            var element = $("#note-" + updatedFields._id);

            if (updatedFields.hasOwnProperty("importance")) {
                var impHtml = createImportanceHtml(updatedFields.importance);
                element.find(".importanceRating-wrap").html(impHtml);
            }
            updateText(element, updatedFields, "description", ".note-description");

            if (updatedFields.hasOwnProperty("description")) {
                addShowMoreHandlers(element);
            }

            updateText(element, updatedFields, "title", ".note-title");


            if (updatedFields.hasOwnProperty("dueDate")) {
                var formatedDate = handlebarUtils.formatDate(updatedFields.dueDate);
                element.find(".note-due-date").text(formatedDate);
            }

            if (updatedFields.hasOwnProperty("completionDate")) {
                var checkbox = element.find("#note-finished-" + updatedFields._id);
                var isChecked = checkbox.prop("checked") ? true : false;
                var hasCompletionDate = updatedFields.completionDate.length > 0;

                if (isChecked !== hasCompletionDate) {
                    checkbox.prop("checked", hasCompletionDate);
                    var label = $("#note-finished-label-" + updatedFields._id);
                    label.text(handlebarUtils.formatFinishedText(updatedFields.completionDate));
                }
            }

        }
    }

    function updateText(searchRoot, updatedFields, property, searchClass) {
        if (updatedFields.hasOwnProperty(property)) {
            searchRoot.find(searchClass).text(updatedFields[property]);
        }
    }

    function createImportanceHtml(newValue) {
        var impHtml = "";
        for (var i = 0; i < newValue; i++) {
            impHtml = impHtml + "<img src=\"../img/bolt-on.svg\">";
        }
        return impHtml;
    }

    function removeNotes(notes) {
        for (var i = 0; i < notes.length; i++) {
            var id = notes[i]._id;
            $("#note-" + id).remove();
        }
    }

    /**
     * Load the notes in the correct order and set the html to the page
     * */
    function reloadNotes() {
        pollingObserver.reloadAll(function (notes) {
            var notesList = $("#js-notes-list");
            notesList.html(createNotesHtml(notes));
            addClickHandlers(notesList);
        });
    }

    function addClickHandlers(searchRoot) {
        addFinishedClickHandler(searchRoot);
        addEditClickHandler(searchRoot);
        addShowMoreHandlers(searchRoot);
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

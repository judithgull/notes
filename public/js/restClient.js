;
(function ($) {
    "use strict";

    var notesPath = "/notes";


    function updateCompletionDate(id, completionDate, callback) {
        var data = {
            completionDate: completionDate
        };
        var requestSettings = {
            url: notesPath + "/" + id,
            data: data,
            type: "PUT"
        };
        $.ajax(requestSettings).done(function () {
            if (callback) {
                callback();
            }
        });
    }

    function getNotes(callback) {
        var sortOrder = notesSettings.getSortOrder();
        var includeFinished = notesSettings.isIncludeFinished();
        var queryString = "?sorting=" + sortOrder + "&includeFinished=" + includeFinished;
        var url = notesPath + queryString;

        $.getJSON(url, function (newNotes) {
            if (callback) {
                callback(newNotes);
            }
        });
    }

    window.restClient = {
        getNotes: getNotes,
        updateCompletionDate: updateCompletionDate
    };
}(jQuery));
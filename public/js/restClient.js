;
(function ($) {
    "use strict";

    var notesPath = "/notes";


    function updateCompletionDate(id, completionDate, doneCallback) {
        var data = {
            completionDate: completionDate
        };
        var requestSettings = {
            url: "/notes/" + id,
            data: data,
            type: "PUT"
        };
        $.ajax(requestSettings).done(function () {
            doneCallback();
        });

    }



    function getNotes(sortOrder, includeFinished, callback) {
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
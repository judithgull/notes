;
(function ($) {
    "use strict";

    var notesPath = "/notes";


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
        getNotes: getNotes
    };
}(jQuery));
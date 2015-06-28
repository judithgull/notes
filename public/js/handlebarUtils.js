/**
 * some utility functions for handlebar templates
 */
;
(function () {
    "use strict";
    moment.locale("en-US");

    function repeat(n, block) {
        var res = "";
        for (var i = 0; i < n; ++i)
            res += block.fn(i);
        return res;
    }

    function formatFinishedText(completionDate) {
        var text = "Finished";

        if (completionDate.length > 0) {
            text += " [" + formatDate(completionDate) + "]";
        }
        return text;
    }

    function formatDate(datetime) {
        if (!datetime) {
            return "someday";
        }

        var dayFormat = "YYYY-MM-DD";
        var dateAsDay = moment(JSON.parse(datetime)).format(dayFormat);
        var today = moment().format(dayFormat);

        if (today === dateAsDay) {
            return "today";
        }

        return moment(today).to(dateAsDay);
    }


    window.handlebarUtils = {
        /**
         * display a date nicely
         * */
        formatDate: formatDate,
        /**
         * display finished text
         * */
        formatFinishedText: formatFinishedText,
        /**
         * repeat(n,block): repeat a block n times
         * */
        repeat: repeat
    };
}());
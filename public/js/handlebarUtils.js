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
        var isToday = function (mom) {
            return mom.day() === moment().day()
                && mom.month() === moment().month()
                && mom.year() === moment().year();
        };

        if (!datetime) {
            return "someday";
        }
        var m = moment(JSON.parse(datetime));
        if (isToday(m)) {
            return "today";
        }
        return m.fromNow();
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
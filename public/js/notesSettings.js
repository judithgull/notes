/**
 * Handle settings in local storage
 * */
;
(function () {
    "use strict";

    function getDisplayStyle(){
        return localStorage.getItem("display-style") || "color";
    }

    function setDisplayStyle(optionValue){
        localStorage.setItem("display-style", optionValue);
    }

    function getSortOrder() {
        return localStorage.getItem("sort-order") || "sort-by-importance";
    }

    function setSortOrder(sortOrder) {
        localStorage.setItem("sort-order", sortOrder);
    }

    function isIncludeFinished() {
        return JSON.parse(localStorage.getItem("includeFinished")) || false;
    }

    function setIncludeFinished(finished) {
        localStorage.setItem("includeFinished", JSON.stringify(finished));
    }

    function toggleIncludeFinished() {
        setIncludeFinished(!isIncludeFinished());
    }

    window.notesSettings = {
        getDisplayStyle: getDisplayStyle,
        setDisplayStyle: setDisplayStyle,
        getSortOrder: getSortOrder,
        setSortOrder: setSortOrder,
        setIncludeFinished: setIncludeFinished,
        toggleIncludeFinished: toggleIncludeFinished,
        isIncludeFinished: isIncludeFinished
    };

}());
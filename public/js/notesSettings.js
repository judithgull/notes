;
(function () {
    "use strict";

    function getDisplayStyle(){
        return localStorage.getItem("display-style") || "color";
    }

    function setDisplayStyle(optionValue){
        localStorage.setItem("display-style", optionValue);
    }

    window.notesSettings = {
        getDisplayStyle: getDisplayStyle,
        setDisplayStyle: setDisplayStyle
    };
}());
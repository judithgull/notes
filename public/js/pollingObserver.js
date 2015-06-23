/**
 * Keeps track of the notes on the client using polling.
 * */
;
(function () {
    "use strict";

    var notes = [];
    var sortOrder = "sort-by-importance";
    var includeFinished = true;
    var listeners = [];

    /**
     * Start polling
     * */
    poll(getNotesFromServer);

    function poll(callback, interval) {
        interval = interval || 1000;

        (function p() {
            callback();
            setTimeout(p, interval);
        })();
    }

    function setSortOrder(newSortOrder) {
        sortOrder = newSortOrder;
    }

    function setIncludeFinished(newIncludeFinished) {
        includeFinished = newIncludeFinished;
    }

    function getSortOrder() {
        return sortOrder;
    }

    function getIncludeFinished() {
        return includeFinished;
    }

    function addChangeListener(listener) {
        listeners.push(listener);
    }

    function removeChangeListener(listener) {
        for (var i = listeners.length; i--;) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
            }
        }
    }

    function getNotes() {
        return notes;
    }

    function getNotesFromServer() {
        restClient.getNotes(
            getSortOrder(),
            getIncludeFinished(),
            function (newNotes) {
                if (listeners.length > 0 && hasChanged(newNotes)) {
                    notes = newNotes;
                    notifyListeners();
                }
            }
        );
    }

    function notifyListeners() {
        var i;
        for (i = 0; i < listeners.length; i++) {
            listeners[i]();
        }
    }


    function hasChanged(newNotes) {
        var origNotes = notes;
        newNotes.sort(idComparator);
        origNotes.sort(idComparator);

        if (newNotes.length !== origNotes.length) {
            return true;
        } else {
            var i;
            for (i = 0; i < newNotes.length; i++) {
                if (!equals(newNotes[i], origNotes[i])) {
                    return true;
                }
            }
            return false;
        }
    }

    function equals(n1, n2) {
        return n1.id === n2.id
            && n1.title === n2.title
            && n1.description === n2.description
            && n1.importance === n2.importance
            && n1.dueDate === n2.dueDate
            && n1.completionDate === n2.completionDate
            && n1.creationDate === n2.creationDate
    }

    function idComparator(note1, note2) {
        return note1.id - note2.id;
    }

    window.pollingObserver = {
        getNotes: getNotes,
        setSortOrder: setSortOrder,
        setIncludeFinished: setIncludeFinished,
        addChangeListener: addChangeListener,
        removeChangeListener: removeChangeListener
    };

}());
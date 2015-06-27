/**
 * Keeps track of the notes on the client using polling.
 * */
;
(function () {
    "use strict";

    var notes = [];
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

    function reloadAll(callback) {
        restClient.getNotes(
            function (newNotes) {
                notes = newNotes;
                if (callback) {
                    callback(notes);
                }
            }
        );
    }

    function getNotesFromServer() {
        restClient.getNotes(
            function (newNotes) {
                if (listeners.length > 0 && hasChanged(newNotes)) {

                    var updatedNotes = [];
                    var newNoteIds = getIdsAsProperties(newNotes);

                    var removedNotes = [];
                    for (var i = 0; i < notes.length; i ++) {
                        var noteId = notes[i]._id;
                        if (newNoteIds.hasOwnProperty(noteId) === false) {
                            removedNotes.push(notes[i]);
                        }
                    }

                    var insertedNotes = [];
                    var origNotesIds = getIdsAsProperties(notes);
                    for (var i = 0; i < newNotes.length; i ++) {
                        var noteId = newNotes[i]._id;
                        if (origNotesIds.hasOwnProperty(noteId) === false) {
                            var noteToInsert = newNotes[i];
                            if(i!=0) {
                                noteToInsert.previousId = newNotes[i - 1]._id;
                            }
                            insertedNotes.push(noteToInsert);
                        }
                    }

                    notes = newNotes;
                    notifyListeners(insertedNotes, updatedNotes, removedNotes);
                }
            }
        );
    }

    function getIdsAsProperties(noteList){
        var noteIds = {};
        for (var i = 0; i < noteList.length; i++ ) {
            noteIds[noteList[i]._id] = true;
        }
        return noteIds;
    };

    function notifyListeners(insertedNotes, updatedNotes, removedNotes) {
        var i;
        for (i = 0; i < listeners.length; i++) {
            listeners[i](insertedNotes, updatedNotes, removedNotes);
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
        reloadAll: reloadAll,
        addChangeListener: addChangeListener,
        removeChangeListener: removeChangeListener
    };

}());
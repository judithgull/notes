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
                if (listeners.length > 0) {

                    var newNoteIds = getIdMap(newNotes);

                    var removedNotes = [];
                    for (var i = 0; i < notes.length; i++) {
                        if (!newNoteIds.hasOwnProperty(notes[i]._id)) {
                            removedNotes.push(notes[i]);
                        }
                    }

                    var insertedNotes = [];
                    var updatedNotes = [];
                    var origNotesIds = getIdMap(notes);
                    for (i = 0; i < newNotes.length; i++) {
                        var newNote = newNotes[i];
                        var noteId = newNote._id;

                        if (i != 0) {
                            newNote.previousId = newNotes[i - 1]._id;
                        }

                        if (!origNotesIds.hasOwnProperty(noteId)) {
                            insertedNotes.push(newNote);
                        } else {
                            var origNote = origNotesIds[noteId];
                            if (!equals(origNote, newNote)) {
                                if (!isSortingRelevantUpdate(origNote, newNote)) {
                                    updatedNotes.push(newNote);
                                } else {
                                    removedNotes.push(newNote);
                                    insertedNotes.push(newNote);
                                }
                            }
                        }
                    }

                    notes = newNotes;
                    if (insertedNotes.length > 0 || updatedNotes.length > 0 || removedNotes.length > 0) {
                        notifyListeners(insertedNotes, updatedNotes, removedNotes);
                    }
                }
            }
        );
    }

    function getIdMap(noteList) {
        var noteIds = {};
        for (var i = 0; i < noteList.length; i++) {
            var note = noteList[i];
            noteIds[note._id] = note;
        }
        return noteIds;
    }

    function notifyListeners(insertedNotes, updatedNotes, removedNotes) {
        var i;
        for (i = 0; i < listeners.length; i++) {
            listeners[i](insertedNotes, updatedNotes, removedNotes);
        }
    }

    function isSortingRelevantUpdate(n1, n2) {
        var sortOrder = notesSettings.getSortOrder();
        if (sortOrder === "sort-by-completion" && n1.completionDate !== n2.completionDate) {
            return true;
        } else if (sortOrder === "sort-by-importance" && n1.importance !== n2.importance) {
            return true;
        }
        return false;
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

    window.pollingObserver = {
        reloadAll: reloadAll,
        addChangeListener: addChangeListener,
        removeChangeListener: removeChangeListener
    };

}());
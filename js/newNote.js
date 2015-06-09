function send() {
    var title = document.getElementById("note-title").value;
    var description = document.getElementById("note-description").value;
    var dueDate = document.getElementById("note-due-date").value;
    var importance = $(".js-importance-rating").attr("data-radio");

    var id = getNoteId();

    if (id === null) {
        var note = notesStorage.addNote(title, description, dueDate, importance);
    } else {
        var note = notesStorage.updateNote(id, title, description, dueDate, importance);
    }

    //jump to list view
    window.location.replace("/index.html");
    return true;
}

function setImportanceValue() {
    var selectedValue = event.toElement.value;
    $(".js-importance-rating").attr("data-radio", selectedValue);
}

$(function(){
    var id = getNoteId();

    if (id !== null) {
        var note = notesStorage.getNote(id);
        var dueDateStr = moment(note.dueDate).format('YYYY-MM-DD');
        $("#note-title").val(note.title);
        $("#note-description").val(note.description);
        $("#note-due-date").val(dueDateStr);
        $(".js-importance-rating").attr("data-radio", note.importance);
        $(".js-importance-rating").find("[value=" + note.importance +"]").prop("checked", true);
    }

});

function getNoteId() {
    var idQueryRegex = /[?&]id=([^&#]+)/;
    var idQueryResult = location.href.match(idQueryRegex);
    if (idQueryResult !== null) {
        return idQueryResult[1];
    }
    return null;
};
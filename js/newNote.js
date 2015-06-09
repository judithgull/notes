function send() {
    var title = document.getElementById("note-title").value;
    var description = document.getElementById("note-description").value;
    var dueDate = document.getElementById("note-due-date").value;
    var importance = $(".js-importance-rating").attr("data-radio");
    var note = notesStorage.addNote(title, description, dueDate, importance);

    //jump to list view
    window.location.replace("/index.html");
    return true;
}

function setImportanceValue() {
    var selectedValue = event.toElement.value;
    $(".js-importance-rating").attr("data-radio", selectedValue);
}

$(function(){
    var idQueryRegex = /[?&]id=([^&#]+)/;
    var idQueryResult = location.href.match(idQueryRegex);

    if (idQueryResult !== null) {
        var id = idQueryResult[1];
        var note = notesStorage.getNote(id);
        var dueDateStr = moment(note.dueDate).format('YYYY-MM-DD');
        document.getElementById("note-title").value = note.title;
        document.getElementById("note-description").value = note.description;
        document.getElementById("note-due-date").value = dueDateStr;
        $(".js-importance-rating").attr("data-radio", note.importance);
        $(".js-importance-rating").find("[value=" + note.importance +"]").prop("checked", true);
    }

});
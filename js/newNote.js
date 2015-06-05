function send() {
    var title = document.getElementById("note-title").value;
    var description = document.getElementById("note-description").value;
    var dueDate = document.getElementById("note-due-date").value;
    var importance = $(".js-importance-rating").attr("data-radio"); // TODO never nullc
    var note = notesStorage.addNote(title, description, dueDate, importance);

    //jump to list view
    window.location.replace("/index.html");
    return true;
}

// TODO: If you click the cancel button it should not submit the form.

function setImportanceValue() {
    var selectedValue = event.toElement.value;
    $(".js-importance-rating").attr("data-radio", selectedValue);
}

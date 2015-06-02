function send() {
    var notes = JSON.parse(sessionStorage.getItem("notes"));
    var note = createNote();
    console.log("New note created");
    console.log(note);

    //add to notes array
    notes.push(note);

    //store
    sessionStorage.setItem("notes", JSON.stringify(notes));

    //jump to list view
    window.location.replace("/index.html");
    return true;
}

// TODO: If you click the cancel button it should not submit the form.

function setImportanceValue() {
    var selectedValue = event.toElement.value;
    $(".js-importance-rating").attr("data-radio", selectedValue);
}

/*
 * Create a new note object with the form data
 * */
function createNote() {
    var note = {};
    note.id = 0; //TODO last of stored items + 1
    note.title = document.getElementById("note-title").value;
    note.description = document.getElementById("note-description").value;
    note.creationDate = new Date();
    note.dueDate = document.getElementById("note-due-date").value;
    note.importance = $(".js-importance-rating").attr("data-radio"); // TODO never null
    return note;
}
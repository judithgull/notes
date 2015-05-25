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

function storeImportance(index) {
    console.log("storeImportance" + index);
    //TODO...
    return false;
}

/*
 * Create a new note object with the form data
 * */
function createNote() {
    var note = {};
    note.title = document.getElementById("n-title").value;
    note.description = document.getElementById("n-desc").value;
    note.dueDate = document.getElementById("n-due-date").value;
    return note;
}
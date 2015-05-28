var notesStr = sessionStorage.getItem("notes");
if (!notesStr) {
    sessionStorage.setItem("notes", JSON.stringify([]));
    notesStr = sessionStorage.getItem("notes");
}
var notes = JSON.parse(notesStr);

//add notes to page
//document.getElementById("body").appendChild("div")

console.log("Current notes in session store:");
console.log(notes);



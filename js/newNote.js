/**
 * On Load
 * */
$(function () {
    var id = getNoteId();

    if (id !== null) {
        load(id);
    }
    $("#note").on("submit", submit);

    /**
     * query note with given id and update html
     * */
    function load(id) {
        $.getJSON("/notes?id=" + id, function (note) {
            $("#note-title").val(note.title);
            $("#note-description").val(note.description);
            $("#note-due-date").val(note.dueDate);
            $(".js-importance-rating").attr("data-radio", note.importance);
            $(".js-importance-rating").find("[value=" + note.importance + "]").prop("checked", true);
        });
    }

    /**
     * submit new or update existing note
     * */
    function submit() {
        var data = {
            id: getNoteId(),
            title: $("#note-title").val(),
            description: $("#note-description").val(),
            dueDate: $("#note-due-date").val(),
            importance: $(".js-importance-rating").attr("data-radio")
        };

        var requestSettings = {
            url: "/note",
            data: JSON.stringify(data),
            type: (data.id === null) ? "POST" : "PUT"
        };
        $.ajax(requestSettings).done(function () {
            //jump to list view
            window.location.replace("/index.html");
        });
        return true;
    }

    function getNoteId() {
        var idQueryRegex = /[?&]id=([^&#]+)/;
        var idQueryResult = location.href.match(idQueryRegex);
        if (idQueryResult !== null) {
            return idQueryResult[1];
        }
        return null;
    }
});

function setImportanceValue() {
    var selectedValue = event.toElement.value;
    $(".js-importance-rating").attr("data-radio", selectedValue);
}

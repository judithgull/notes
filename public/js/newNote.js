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
        $.getJSON("/notes/" + id, function (note) {
            $("#note-title").val(note.title);
            $("#note-description").val(note.description);
            $("#note-due-date").val(formatToDay(note.dueDate));
            $("#importance-rating").find("[value=" + note.importance + "]").prop("checked", true);
        });
    }

    /**
     * submit new or update existing note
     * */
    function submit() {
        var id = getNoteId();
        var data = {
            title: $("#note-title").val(),
            description: $("#note-description").val(),
            dueDate: $("#note-due-date").val(),
            importance: getRating()
        };

        if (id === null) {
            var requestSettings = {
                url: "/notes",
                data: data,
                type: "POST"
            };
            $.ajax(requestSettings).done(function () {
                //jump to list view
                window.location.replace("/index.html");
            });
        } else {
            var requestSettings = {
                url: "/notes/" + id,
                data: data,
                type: "PUT"
            };
            $.ajax(requestSettings).done(function () {
                //jump to list view
                window.location.replace("/index.html");
            });

        }

        return true;
    }

    function formatToDay(date) {
        if (date) {
            return moment(JSON.parse(date)).format('YYYY-MM-DD');
        }
        return null;
    }

    function getNoteId() {
        var idQueryRegex = /[?&]id=([^&#]+)/;
        var idQueryResult = location.href.match(idQueryRegex);
        if (idQueryResult !== null) {
            return idQueryResult[1];
        }
        return null;
    }

    function getRating() {
        var checkedRadio = $("#importance-rating").find(":checked");
        if (checkedRadio.length>0) return checkedRadio.attr("value");
        else return 0;
    }
});


"use strict";
$(function () {
    moment.locale("en-US");
    registerHandlebarsHelpers();
    var createNotesHtml = Handlebars.compile($("#notes-entry-template").html());

    reloadNotes();

    /**
     * Register Click-Handler on Sort Tabs
     * */
    $("#sort-tabs").on("click", function () {
        var selectedId = event.toElement.id;
        activateTab(selectedId);
        reloadNotes();
    });

    function activateTab(id) {
        var activeMarker = "tab-item--active";
        $("." + activeMarker).toggleClass(activeMarker);
        $("#" + id).parent().toggleClass(activeMarker);
    }

    /**
     * Register Click-Handler on Finished Button
     */
    $("#show-finished-btn").on("click", function () {
        $("#show-finished-btn").toggleClass("btn--active");
        reloadNotes();
    });


    /**
     * Load the notes in the correct order and set the html to the page
     * */
    function reloadNotes() {
        var sortOrderId = $(".tab-item--active").children().first().attr("id");
        var isShowFinished = Boolean($(".btn--active").length);

        var getNotesUrl = "/notes?sorting=" + sortOrderId + "&includeFinished=" + isShowFinished;

        $.getJSON(getNotesUrl, function (notes) {
            document.getElementById("js-notes-list").innerHTML = createNotesHtml(notes);

            /**
             * Register Handler for finished checkboxes
             */
            var notesCheckboxes = $("#js-notes-list").find("[type=\"checkbox\"]");
            notesCheckboxes.on("click", function () {
                var checkbox = $("#" + this.id);
                var isChecked = checkbox.prop("checked") ? true : false;
                var id = checkbox.parents("li").attr("data-id");

                var completionDate = (isChecked) ? new Date() : null;
                var data = {
                    completionDate: completionDate
                };

                var requestSettings = {
                    url: "/notes/" + id,
                    data: data,
                    type: "PUT"
                };
                $.ajax(requestSettings).done(function () {
                    //jump to list view
                    reloadNotes();
                });

            });

            /**
             * Register Handler on Edit Button
             * */
            var editButtons = $("#js-notes-list").find("button");
            editButtons.on("click", function () {
                var id = $("#" + this.id).parents("li").attr("data-id");
                location.href = "note.html?id=" + id;
            });


            var showChar = 200;
            var ellipsestext = "...";
            var moretext = "more";
            var lesstext = "less";
            $('.more').each(function () {
                var content = $(this).html();
                if (content.length > showChar) {
                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar - 1, content.length - showChar);
                    var html = c + '<span class="moreellipses">' + ellipsestext + ' </span><span class="morecontent"><span>' + h + '</span>  <a href="" class="morelink t-link">' + moretext + '</a></span>';
                    $(this).html(html);
                }
            });
            $(".morelink").click(function () {
                if ($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).html(moretext);
                } else {
                    $(this).addClass("less");
                    $(this).html(lesstext);
                }
                $(this).parent().prev().toggle();
                $(this).prev().toggle();
                return false;
            });

        });

    }

    /**
     * Helper functions for templating:
     * repeat(n,block): repeat a block n times
     * formatDate(date): display a date nicely
     */
    function registerHandlebarsHelpers() {
        Handlebars.registerHelper('repeat', function (n, block) {
            var res = "";
            for (var i = 0; i < n; ++i)
                res += block.fn(i);
            return res;
        });

        function formatDate(datetime) {
            var isToday = function (mom) {
                return mom.day() === moment().day()
                    && mom.month() === moment().month()
                    && mom.year() === moment().year();
            };

            if (!datetime) {
                return "someday";
            }
            var m = moment(JSON.parse(datetime));
            if (isToday(m)) {
                return "today";
            }
            return m.fromNow();
        }

        Handlebars.registerHelper("formatDate", formatDate);
    }

});


"use strict";

$(function () {
  var displayStyle = notesSettings.getDisplayStyle();
  loadCSS(displayStyle);

  var selStyleEl = $("#sel-display-style");
  if (selStyleEl) {
    selStyleEl.val(displayStyle);

    selStyleEl.on("change", function(){
      var displayStyle = selStyleEl.val();
      notesSettings.setDisplayStyle(displayStyle);
      loadCSS(displayStyle);
    });
  }
});


function loadCSS(displayStyle){
  document.getElementById('js-stylesheet').setAttribute('href', "../css/styles-" + displayStyle + ".css");
}

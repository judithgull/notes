
"use strict";

$(function () {
  var optionValue = loadCSS();
  var selStyleEl = document.getElementById("sel-display-style");
  if (selStyleEl) {
    $("#sel-display-style").val(optionValue);
    selStyleEl.addEventListener("change", function(){
      storeStyleOption();
      loadCSS();
    });
  }
});


// changes stylesheet without pagereload.
function storeStyleOption(){
  //get the value of options in dropdown.
  var selectorStyle = document.getElementById("sel-display-style");
  var optionValue = selectorStyle.options[selectorStyle.selectedIndex].value;
  localStorage.setItem("display-style", optionValue);
}

function loadCSS(){
  var optionValue = localStorage.getItem("display-style") || "color";
  document.getElementById('js-stylesheet').setAttribute('href', "../css/styles-" + optionValue + ".css");
  return optionValue;
}

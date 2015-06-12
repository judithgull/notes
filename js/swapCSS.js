
"use strict";

$(function () {
  document.getElementById("sel-display-style").addEventListener("change", swapStyleSheet);
});



// changes stylesheet without pagereload.
function swapStyleSheet(){
  //get the value of options in dropdown.
  var selectorStyle = document.getElementById("sel-display-style");
  var optionValue = selectorStyle.options[selectorStyle.selectedIndex].value;

  document.getElementById('js-stylesheet').setAttribute('href', "css/styles-" + optionValue + ".css");
}

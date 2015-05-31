
"use strict";

// changes stylesheet without pagereload.
function swapStyleSheet(cssFilePath){
  document.getElementById('js-stylesheet').setAttribute('href', cssFilePath);
}
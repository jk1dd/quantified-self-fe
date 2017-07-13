var $ = require('jquery');

function foodSearch(tableName, rowName) {
  $(`#${tableName}`).keyup(function() {
    var input = document.getElementById(tableName)
    var filter = input.value.toUpperCase()
    var foodRows = document.getElementsByClassName(rowName)

    for (i = 0; i < foodRows.length; i++) {
      var foodName = foodRows[i].innerText
      if (foodName.toUpperCase().indexOf(filter) > -1) {
        foodRows[i].parentElement.style.display = "";
      } else {
        foodRows[i].parentElement.style.display = "none";
      }
    }
  })
}

module.exports = {
  foodSearch: foodSearch
}

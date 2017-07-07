var $ = require('jquery');
var Food = require('./food')

$(function(){
  Food.allFoodsToHTML()
  .then(function(allFoodsToHTML){
    $("#foods").append(allFoodsToHTML)
  })
})

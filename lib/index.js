var $ = require('jquery');
var Food = require('./food')

function getFoodFromForm(){
  var name = $("input[placeholder='Food Name']").val()
  var calories = $("input[placeholder='Calories']").val()

  return new Food ({
    name: name,
    calories: calories
  })
}


$(function(){
  Food.allFoodsToHTML()
  .then(function(allFoodsToHTML){
    $("#foods").append(allFoodsToHTML)
  })

    $('input[type=submit]').on('click', function(event){
      event.preventDefault()
      var newFood = getFoodFromForm()
      newFood.createFood()
      .then(function(fullEntry){
        $('#foods').append(newFood.toHTML())
      })
    })

    // $("#food-form")[0].reset(); // trying to get form to clear

})

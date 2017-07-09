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
      if (!newFood.name) {
        $(".error").remove()
        $("input[placeholder='Food Name']").parent().after('<span class="error">Please enter a food name. </span>')
      } else if (!newFood.calories) {
        $(".error").remove()
        $("input[placeholder='Calories']").parent().after('<span class="error">Please enter a calorie amount.</span>')
      }
      newFood.createFood()
      .then(function(fullEntry){
        $(".error").remove()
        $('#title-row').after(newFood.toHTML())
      })
      $("#food-form")[0].reset()
    })

})

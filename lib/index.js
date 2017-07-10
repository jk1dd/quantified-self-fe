var $ = require('jquery');
var Food = require('./food')
var FoodMeal = require('./food-meal')

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
        $('#title-row').after(fullEntry.toHTML())
      })
      $("#food-form")[0].reset()
    })

    $('#foods').on('click', function(event){
      var food_id = $(event.target.parentElement.parentElement).data("id")
      $(event.target.parentElement.parentElement).remove()
      Food.deleteFood(food_id)
    })

})

$(function(){
  for(i=1; i<5; i++){
    FoodMeal.mealFoodsToHTML(i)
    .then(function(foodMeals){
        var mealId = foodMeals[0].mealId
        var totalCalories = 0
        foodMeals.forEach(function(foodMeal){
          totalCalories += foodMeal.calories
          $(`#meal-${foodMeal.mealId}`).append(foodMeal.html)
        })
        $(`#meal-${mealId}`).append(FoodMeal.totalRow(totalCalories))
        $(`#meal-${mealId}`).append(FoodMeal.remainingRow(mealId, totalCalories))
    })
  }
})

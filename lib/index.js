var $ = require('jquery');
var Food = require('./food')
var FoodMeal = require('./food-meal')

$(function(){
  Food.allFoodsToHTML()
  .then(function(allFoodsToHTML){
    $("#foods").append(allFoodsToHTML)
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

var Food = require('./food')
var FoodMeal = require('./food-meal')
var $ = require('jquery');

function getFoodFromForm(){
  var name = $("input[placeholder='Food Name']").val()
  var calories = $("input[placeholder='Calories']").val()

  return new Food ({
    name: name,
    calories: calories
  })
}

function updateMealsCalories(mealId, totalCalories) {
  $(`#meal-${mealId}`).append(FoodMeal.totalRow(totalCalories))
  $(`#meal-${mealId}`).append(FoodMeal.remainingRow(mealId, totalCalories))
  var remainingCalories = +$(`#meal-${mealId} tr.remaining-calories th.remaining`).text()
  if (remainingCalories < 0) {
    $(`#meal-${mealId} tr.remaining-calories th.remaining`).removeClass("positive-value")
    $(`#meal-${mealId} tr.remaining-calories th.remaining`).addClass("negative-value")
  }
}

function returnAllMeals() {
  for(i=1; i<5; i++){
    FoodMeal.mealFoodsToHTML(i)
    .then(function(foodMeals){
        var mealId = foodMeals[0].mealId
        var totalCalories = 0
        foodMeals.forEach(function(foodMeal){
          totalCalories += foodMeal.calories
          $(`#meal-${foodMeal.mealId}`).append(foodMeal.html)
        })
        updateMealsCalories(mealId, totalCalories)
    }).then(function(){
      updateOverallCalories()
    })
  }
}

function updateOverallCalories(){
  var overallCalories = 0
  $('tr th.total-calories').each(function() {
    var cals = +$(this).text()
    overallCalories += cals
  })
  var remaining = 2000 - overallCalories
  $('#consumed').text(overallCalories)
  $('#total-remaining').text(remaining)
  if (remaining < 0) {
    $('#total-remaining').removeClass("postive-value")
    $('#total-remaining').addClass("negative-value")
  }
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
      if ($(event.target).hasClass('fa')) {
        var food_id = $(event.target.parentElement.parentElement).data("id")
        $(event.target.parentElement.parentElement).remove()
        Food.deleteFood(food_id)
      }
    })

    $('#foods').focusout(function(event) {
      var food_id = $(event.target.parentElement).data("id")

      if ($(event.target).hasClass('name')) {
        var updatedName = event.target.innerText
        var calories = event.target.nextElementSibling.innerText
        Food.updateFood(food_id, updatedName, calories)
      } else {
        var updatedCalories = event.target.innerText
        var name = event.target.previousElementSibling.innerText
        Food.updateFood(food_id, name, updatedCalories)
      }
    })

    $('#name-search').keyup(function() {
      var input = document.getElementById('name-search')
      var filter = input.value.toUpperCase()
      var table = document.getElementById("foods")
      var foodRows = document.getElementsByClassName('name')

      for (i = 0; i < foodRows.length; i++) {
        var foodName = foodRows[i].innerText
        if (foodName.toUpperCase().indexOf(filter) > -1) {
          foodRows[i].parentElement.style.display = "";
        } else {
          foodRows[i].parentElement.style.display = "none";
        }
      }
    })

})

$(function(){
  returnAllMeals()
})

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

function returnAllFoods(){
  Food.allFoodsToDiary()
  .then(function(allFoodsToHTML){
    $(".diary-foods-table table").append(allFoodsToHTML)
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

function updateMealTable(id) {
  $(`#meal-${id}`).find("tr:gt(0)").remove()
  FoodMeal.mealFoodsToHTML(id)
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

function returnAllMeals() {
  for(i=1; i<5; i++){
    updateMealTable(i)
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
    $('#total-remaining').removeClass("positive-value")
    $('#total-remaining').addClass("negative-value")
  } else {
    $('#total-remaining').removeClass("negative-value")
    $('#total-remaining').addClass("positive-value")
  }
}

function addFoodToMeal() {
  $('.meal-buttons').on('click', function(event){
    if ($(event.target).hasClass("btn")) {
      var mealId = $(event.target).data('id')
      var foods = $('.diary-food .selected input:checked')
      foods.each(function(i){
        var foodId = $(this.parentElement.parentElement).data('id')
        FoodMeal.addFoodToMeal(mealId, foodId).then(function(){
          if (i == foods.length-1) {
            updateMealTable(mealId)
            uncheckCheckboxes()
          }
        })
      })
    }
  })
}

function uncheckCheckboxes() {
  $('.diary-food .selected input:checked').prop('checked', false)
}

function deleteFoodFromMeal () {
  $(".meal-rows").on("click", function(event){
    if ($(event.target).hasClass('fa')) {
      var mealId = +event.target.parentElement.parentElement.parentElement.parentElement.id[5]
      var foodMealId = $(event.target.parentElement.parentElement).data("id")
      FoodMeal.deleteFoodOnMeal(foodMealId).then(function(){
        updateMealTable(mealId)
      })
    }
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

function sortFoodMeals() {
  $('.meal-rows').on("click", function(event){
    if ($(event.target).hasClass('calories')) {
      var mealId = +event.target.parentElement.parentElement.parentElement.id[5]
      incrementClicks(mealId)
      var clicks = clickCounts[mealId]
      if (clicks === 1 || clicks === 2) {
        var unsortedMeals = $(`#meal-${mealId} .food-meal`)
        var unsortedObjects = unsortedMeals.map(function(food){
          var cals = +this.children[1].textContent
          var html = this
          return { calories: cals, html: html }
        })
        var sortedFoods = sortByCals(unsortedObjects, clicks)
        $(`#meal-${mealId}`).find("tr:gt(0)").remove()
        var totalCalories = 0
        sortedFoods.each(function(){
          totalCalories += this.calories
          $(`#meal-${mealId}`).append(this.html)
        })
        updateMealsCalories(mealId, totalCalories)
      } else {
        updateMealTable(mealId)
      }

    }
  })
}

function sortByCals(unsortedObjects, orderBy) {
  if (orderBy === 1) {
    return unsortedObjects.sort(function(a,b){
      return a.calories - b.calories
    })
  } else {
    return unsortedObjects.sort(function(a,b){
      return b.calories - a.calories
    })
  }
}

function incrementClicks(mealId) {
  if (clickCounts[mealId] < 2) {
    clickCounts[mealId]++
  } else {
    clickCounts[mealId] = 0
  }
}




$(function(){
  clickCounts = {
    1 : 0,
    2 : 0,
    3 : 0,
    4 : 0
  }
  returnAllMeals()
  returnAllFoods()
  addFoodToMeal()
  deleteFoodFromMeal()
  sortFoodMeals()
})

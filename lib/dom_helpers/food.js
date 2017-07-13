var $ = require('jquery');
var Food = require('../food')

function returnAllFoods() {
  Food.allFoodsToHTML()
  .then(function(allFoodsToHTML){
    $("#foods").append(allFoodsToHTML)
  })
}

function addNewFood() {
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
}

function getFoodFromForm(){
  var name = $("input[placeholder='Food Name']").val()
  var calories = $("input[placeholder='Calories']").val()

  return new Food ({
    name: name,
    calories: calories
  })
}

function deleteFood() {
  $('#foods').on('click', function(event){
    if ($(event.target).hasClass('fa')) {
      var food_id = $(event.target.parentElement.parentElement).data("id")
      $(event.target.parentElement.parentElement).remove()
      Food.deleteFood(food_id)
    }
  })
}

function editFood() {
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
}

module.exports = {
  returnAllFoods: returnAllFoods,
  addNewFood: addNewFood,
  deleteFood: deleteFood,
  editFood: editFood
}

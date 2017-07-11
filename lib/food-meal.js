var $ = require('jquery')
var host = require('./config').host


function FoodMeal(foodMeal) {
  this.id = foodMeal.id
  this.name = foodMeal.name
  this.calories = foodMeal.calories
  this.mealId = foodMeal.meal_id
}

FoodMeal.prototype.toHTML = function() {
  return `<tr class="food-meal" data-id=${this.id}>
            <td class="name">${this.name}</td>
            <td class="calories">${this.calories}</td>
            <td><i class="fa fa-close"></i></td>
          </tr>`
}

FoodMeal.totalRow = function(totalCalories) {
  return `<tr class="total-calories-row">
          <th>Total Calories</th>
          <th class="total-calories">${totalCalories}</th>
          <th></th>
        </tr>`
}

FoodMeal.remainingRow = function(mealId, totalCalories) {
  var goalLookup = {
    1: 400,
    2: 600,
    3: 800,
    4: 200
  }
  return `<tr class="remaining-calories">
          <th>Remaining Calories</th>
          <th class="remaining positive-value">${goalLookup[mealId] - totalCalories}</th>
          <th></th>
        </tr>`
}

FoodMeal.mealFoodsToHTML = function(id) {
  return this.getFoodsForMeal(id)
  .then(function(foodMeals){
    return foodMeals.map(function(foodMeal){
      return new FoodMeal(foodMeal);
    })
  })
  .then(function(foodMeals) {
    return foodMeals.map(function(foodMeal) {
      return {
        mealId: foodMeal.mealId,
        calories: foodMeal.calories,
        html: foodMeal.toHTML()};
    })
  })
}

FoodMeal.getFoodsForMeal = function(id) {
  return $.getJSON(`${host}/api/meals/${id}`)
}

module.exports = FoodMeal

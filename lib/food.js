var $ = require('jquery');
var host = require('./config').host

function Food(food) {
  this.id = food.id
  this.name = food.name
  this.calories = food.calories
}

Food.prototype.toHTML = function() {
  return `<tr class="food" data-id=${this.id}>
            <td>${this.name}</td>
            <td>${this.calories}</td>
            <td><i class="fa fa-close"></i></td>
          </tr>`
}

Food.allFoodsToHTML = function() {
  return this.getAllFoods()
  .then(function(foods){
    return foods.map(function(food){
      return new Food(food);
    })
  })
  .then(function(foods) {
    return foods.map(function(food) {
      return food.toHTML();
    }).reverse()
  })
}

Food.getAllFoods = function() {
  return $.getJSON(`${host}/api/foods`)
}

Food.prototype.createFood = function() {
  return $.post( `${host}/api/foods`,
    { name: this.name, calories: this.calories } )
    .then(function(foodObject){
      return new Food(foodObject[foodObject.length-1])
    })
}

module.exports = Food

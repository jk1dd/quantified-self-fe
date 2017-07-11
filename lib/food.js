var $ = require('jquery');
var host = require('./config').host

function Food(food) {
  this.id = food.id
  this.name = food.name
  this.calories = food.calories
}

Food.prototype.toHTML = function() {
  return `<tr class="food" data-id=${this.id}>
            <td contenteditable="true" class="name">${this.name}</td>
            <td contenteditable="true" class="calories">${this.calories}</td>
            <td><i class="fa fa-close" delete-id="food-${this.id}"></i></td>
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

Food.deleteFood = function(id) {
  return $.ajax({
    url: `${host}/api/foods/` + id,
    method: 'DELETE',
    success: function(){}
  })
}

Food.updateFood = function(id, name, calories) {
  // debugger
  return $.ajax({
    url: `${host}/api/foods/${id}`,
    method: 'PUT',
    data: {name: name, calories: calories},
  })
}

// Food.updateFoodName = function(id, updatedName) {
//   return $.ajax({
//       url: `${host}/api/foods/` + id,
//       method: 'PUT',
//       data: {name: updatedName},
//   })
// }
//
// Food.updateFoodCalories = function(id, updatedCalories) {
//   return $.ajax({
//       url: `${host}/api/foods/${id}`,
//       method: 'PUT',
//       data: {calories: updatedCalories},
//   })
// }

module.exports = Food

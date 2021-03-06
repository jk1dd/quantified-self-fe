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

Food.prototype.toDiaryHTML = function() {
  return `<tr class="diary-food" data-id=${this.id}>
            <td class="selected"><input type="checkbox"></td>
            <td class="diary-name">${this.name}</td>
            <td>${this.calories}</td>
          </tr>`
}

Food.allFoodsToDiary = function() {
  return this.getAllFoods()
  .then(function(foods){
    return foods.map(function(food){
      return new Food(food);
    })
  })
  .then(function(foods) {
    return foods.map(function(food){
      return food.toDiaryHTML();
    }).reverse()
  })
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
  return $.ajax({
    url: `${host}/api/foods/${id}`,
    method: 'PUT',
    data: {name: name, calories: calories},
  })
}

module.exports = Food

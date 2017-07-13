var Food = require('./food')
var FoodMeal = require('./food-meal')
var $ = require('jquery');
var indexHelper = require('./dom_helpers/index')
var sharedHelper = require('./dom_helpers/shared')
var foodHelper = require('./dom_helpers/food')

$(function(){
  // food.html
  foodHelper.returnAllFoods()
  foodHelper.addNewFood()
  foodHelper.deleteFood()
  foodHelper.editFood()
  sharedHelper.foodSearch('name-search', 'name')
  // index.html
  clickCounts = {
    1 : 0,
    2 : 0,
    3 : 0,
    4 : 0
  }
  indexHelper.returnAllMeals()
  indexHelper.returnAllFoods()
  indexHelper.addFoodToMeal()
  indexHelper.deleteFoodFromMeal()
  indexHelper.sortFoodMeals()
  sharedHelper.foodSearch('diary-name-search', 'diary-name')
})

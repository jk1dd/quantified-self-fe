var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"

test.describe('testing viewing meal diary', function() {
  var driver;
  this.timeout(1000000);

  test.beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  })

  test.afterEach(function() {
    driver.quit();
  })

  test.it("lists four meal tables", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElements({css: "body .meal table"})
    .then(function(meals) {
      assert.lengthOf(meals, 4);
    })
  })

  test.it("meal tables have foods with names and calories", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .name"}).getText()
    .then(function(foodName) {
      assert.equal(foodName, "Orange")
    })
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal(foodCalories, "90")
    })
    driver.findElement({css: "#meal-4 .food-meal[data-id='10'] .name"}).getText()
    .then(function(foodName) {
      assert.equal(foodName, "Orange")
    })
    driver.findElement({css: "#meal-4 .food-meal[data-id='10'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal(foodCalories, "90")
    })
  })

  test.it("each meal table has a total calories calculation at the bottom", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElement({css: "#meal-1 .total-calories-row"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Total Calories")
      assert.include(totalCalorieRow, "495")
    })
    driver.findElement({css: "#meal-2 .total-calories-row"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Total Calories")
      assert.include(totalCalorieRow, "495")
    })
    driver.findElement({css: "#meal-3 .total-calories-row"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Total Calories")
      assert.include(totalCalorieRow, "495")
    })
    driver.findElement({css: "#meal-4 .total-calories-row"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Total Calories")
      assert.include(totalCalorieRow, "495")
    })
  })

  test.it("each meal table has a remaining calories calculation at the very bottom", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElement({css: "#meal-1 .remaining-calories"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Remaining Calories")
      assert.include(totalCalorieRow, "-95")
    })
    driver.findElement({css: "#meal-2 .remaining-calories"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Remaining Calories")
      assert.include(totalCalorieRow, "105")
    })
    driver.findElement({css: "#meal-3 .remaining-calories"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Remaining Calories")
      assert.include(totalCalorieRow, "305")
    })
    driver.findElement({css: "#meal-4 .remaining-calories"}).getText()
    .then(function(totalCalorieRow) {
      assert.include(totalCalorieRow, "Remaining Calories")
      assert.include(totalCalorieRow, "-295")
    })
  })

  test.it("has a total calories table", function(){
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElement({css: ".totals"}).getText()
    .then(function(totalsTable){
      assert.include(totalsTable, "Goal Calories")
      assert.include(totalsTable, "2000")
      assert.include(totalsTable, "Calories Consumed")
      assert.include(totalsTable, "Remaining")
    })
    driver.findElement({css: ".totals #consumed"}).getText()
    .then(function(consumedCalories){
      assert.equal(consumedCalories, "1980")
    })
    driver.findElement({css: ".totals #total-remaining"}).getText()
    .then(function(remainingCalories){
      assert.equal(remainingCalories, "20")
    })
  })

  test.it("displays positive remaining calories for meals and total in green", function(){
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElement({css: "#meal-2 tr.remaining-calories th.positive-value"}).getText()
    .then(function(remainingCalories){
      assert.equal(remainingCalories, "105")
    })
    driver.findElement({css: "#meal-3 tr.remaining-calories th.positive-value"}).getText()
    .then(function(remainingCalories){
      assert.equal(remainingCalories, "305")
    })
    driver.findElement({css: ".totals th.positive-value"}).getText()
    .then(function(remainingCalories){
      assert.equal(remainingCalories, "20")
    })
  })

  test.it("displays negative remaining calories for meals and total in red", function(){
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))
    driver.findElement({css: "#meal-1 tr.remaining-calories th.negative-value"}).getText()
    .then(function(remainingCalories){
      assert.equal(remainingCalories, "-95")
    })
    driver.findElement({css: "#meal-4 tr.remaining-calories th.negative-value"}).getText()
    .then(function(remainingCalories){
      assert.equal(remainingCalories, "-295")
    })
  })

});

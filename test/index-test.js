var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"

test.describe('testing food index', function() {
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
      assert.equal("Orange", foodName)
    })
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal("90", foodCalories)
    })
    driver.findElement({css: "#meal-4 .food-meal[data-id='10'] .name"}).getText()
    .then(function(foodName) {
      assert.equal("Orange", foodName)
    })
    driver.findElement({css: "#meal-4 .food-meal[data-id='10'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal("90", foodCalories)
    })
  })


});

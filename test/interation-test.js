var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"
var Food = require('../lib/food')
var pry = require('pryjs')
var $ = require('jquery');
var host = require('../lib/config').host

test.describe('testing food and diary interactions', function() {
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


  test.it('persists changes on food to the diary', function() {
    driver.get(`${frontEndLocation}/index.html`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))

    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .name"}).getText()
    .then(function(foodName) {
      assert.equal(foodName, "Orange")
    })
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal(foodCalories, "90")
    })

    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElement({css: "tr.food[data-id='1'] td.name[contenteditable='true']"})
    .click()
    driver.findElement({css: "tr.food[data-id='1'] td.name[contenteditable='true']"})
    .sendKeys("Blackberry")
    driver.findElement({css: "body"})
    .click()

    driver.findElement({css: "#foods .food[data-id='1']"}).getText()
    .then(function(name){
      assert.include(name, "OrangeBlackberry")
    })
    driver.findElement({css: "#foods .food[data-id='1']"}).getText()
    .then(function(calories){
      assert.include(calories, 90)
    })

    driver.get(`${frontEndLocation}/index.html`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))

    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .name"}).getText()
    .then(function(foodName) {
      assert.equal(foodName, "OrangeBlackberry")
    })
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal(foodCalories, "90")
    })
  })

  test.it("leaves deleted food in the meal diary", function() {
    driver.get(`${frontEndLocation}/index.html`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))

    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .name"}).getText()
    .then(function(foodName) {
      assert.equal(foodName, "OrangeBlackberry")
    })
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal(foodCalories, "90")
    })

    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElement({css: "#foods .fa[delete-id='food-1']"})
    .click()

    driver.get(`${frontEndLocation}/index.html`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))

    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .name"}).getText()
    .then(function(foodName) {
      assert.equal(foodName, "OrangeBlackberry")
    })
    driver.findElement({css: "#meal-1 .food-meal[data-id='1'] .calories"}).getText()
    .then(function(foodCalories) {
      assert.equal(foodCalories, "90")
    })
  })

  test.it("Create New button redirects to foods.html", function() {
    driver.get(`${frontEndLocation}/index.html`)
    driver.wait(until.elementLocated({css: "#meal-4 .remaining-calories"}))

    driver.findElement({css: "#create-food"})
    .click()

    driver.getCurrentUrl()
    .then(function(currentUrl){
      assert.equal(currentUrl, `${frontEndLocation}/foods.html`)
    })
  })
})

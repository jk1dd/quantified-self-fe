var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"
var Food = require('../lib/food')
var pry = require('pryjs')
var $ = require('jquery');
var host = require('../lib/config').host

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

  test.it("it resets the database", function(){
    driver.get("http://qs-food-log.herokuapp.com/api/meals/reset")
  })

  test.it("lists all the foods on load", function() {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))
    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 3);
    })
    driver.findElement({css: "#foods .food[data-id='1']"}).getText()
    .then(function(tableRow){
      assert.include(tableRow, "Orange")
      assert.include(tableRow, 90)
    })
  })

  test.it("lets a user create a new food", function(){
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 3);
    })

    driver.findElement({css: "input#food-name-field.form-field"})
    .sendKeys("Pizza")
    driver.findElement({css: "input#calories-field.form-field"})
    .sendKeys(300)
    driver.findElement({css: "input[type=submit]"})
    .click()

    driver.sleep(5000)

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 4);
    })

    driver.findElement({css: "#foods .food[data-id='4']"}).getText()
    .then(function(name){
      assert.include(name, "Pizza")
    })
    driver.findElement({css: "#foods .food[data-id='4']"}).getText()
    .then(function(calories){
      assert.include(calories, 300)
    })

  })

  test.it("shows an error for missing name", function(){
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElement({css: "input#food-name-field.form-field"})
    .sendKeys("")
    driver.findElement({css: "input#calories-field.form-field"})
    .sendKeys(300)
    driver.findElement({css: "input[type=submit]"})
    .click()

    driver.findElement({css: ".error"}).getText()
    .then(function(message){
      assert.include(message, "Please enter a food name.")
    })

    driver.findElement({css: "input#food-name-field.form-field"})
    .sendKeys("Lil Smokies")
    driver.findElement({css: "input#calories-field.form-field"})
    .sendKeys(300)
    driver.findElement({css: "input[type=submit]"})
    .click()

    driver.sleep(5000)

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 5);
    })

    driver.findElement({css: "#foods .food[data-id='5']"}).getText()
    .then(function(name){
      assert.include(name, "Lil Smokies")
    })
    driver.findElement({css: "#foods .food[data-id='5']"}).getText()
    .then(function(calories){
      assert.include(calories, 300)
    })

  })

  test.it("shows an error for missing calories", function(){
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElement({css: "input#food-name-field.form-field"})
    .sendKeys("Watermelon")
    driver.findElement({css: "input#calories-field.form-field"})
    .sendKeys("")
    driver.findElement({css: "input[type=submit]"})
    .click()

    driver.findElement({css: ".error"}).getText()
    .then(function(message){
      assert.include(message, "Please enter a calorie amount.")
    })

    driver.findElement({css: "input#food-name-field.form-field"})
    .sendKeys("Burger")
    driver.findElement({css: "input#calories-field.form-field"})
    .sendKeys(300)
    driver.findElement({css: "input[type=submit]"})
    .click()

    driver.sleep(5000)

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 6);
    })
  })


  test.it("lets a user edit a food name", function(){
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 6);
    })

    driver.findElement({css: "#foods .food[data-id='4']"}).getText()
    .then(function(name){
      assert.include(name, "Pizza")
    })
    driver.findElement({css: "#foods .food[data-id='4']"}).getText()
    .then(function(calories){
      assert.include(calories, 300)
    })

    driver.findElement({css: "tr.food[data-id='4'] td.name[contenteditable='true']"})
    .click()
    driver.findElement({css: "tr.food[data-id='4'] td.name[contenteditable='true']"})
    .sendKeys("Blackberry")
    driver.findElement({css: "body"})
    .click()

    driver.findElement({css: "#foods .food[data-id='4']"}).getText()
    .then(function(name){
      assert.include(name, "Blackberry")
    })
    driver.findElement({css: "#foods .food[data-id='4']"}).getText()
    .then(function(calories){
      assert.include(calories, 300)
    })

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 6);
    })
  })

  test.it("lets a user edit a food calories", function(){
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 6);
    })

    driver.findElement({css: "#foods .food[data-id='5']"}).getText()
    .then(function(name){
      assert.include(name, "Lil Smokies")
    })
    driver.findElement({css: "#foods .food[data-id='5']"}).getText()
    .then(function(calories){
      assert.include(calories, 300)
    })

    driver.findElement({css: "tr.food[data-id='5'] td.calories[contenteditable='true']"})
    .click()
    driver.findElement({css: "tr.food[data-id='5'] td.calories[contenteditable='true']"})
    .sendKeys(500)
    driver.findElement({css: "body"})
    .click()

    driver.findElement({css: "#foods .food[data-id='5']"}).getText()
    .then(function(name){
      assert.include(name, "Lil Smokies")
    })
    driver.findElement({css: "#foods .food[data-id='5']"}).getText()
    .then(function(calories){
      assert.include(calories, 500)
    })

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 6);
    })
  })

  test.it("lets a user filter foods", function() {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElements({css: "#foods .food[style='display: none;']"})
    .then(function(foods) {
      assert.lengthOf(foods, 0);
    })

    driver.findElement({css: "#name-search"})
    .sendKeys("burg")

    driver.findElements({css: "#foods .food[style='display: none;']"})
    .then(function(foods) {
      assert.lengthOf(foods, 5);
    })

  })

  test.it("lets a user delete a food", function(){
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 6);
    })

    driver.findElement({css: "#foods .fa[delete-id='food-5']"})
    .click()

    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 5);
    })
  })


});

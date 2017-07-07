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

  test.it("lists all the foods on load", function() {
    // var foodCount = Food.getAllFoods().then(function(data){
    //   return data.rowCount
    // })
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#foods .food"}))
    driver.findElements({css: "#foods .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 3);
      // assert.include()
    })
    driver.findElement({css: "#foods .food[data-id='1']"}).getText()
    .then(function(tableRow){
      assert.include(tableRow, "Orange")
      assert.include(tableRow, 90)
    })
  })

  // test.it("lets a user create a new entry", function(){
  //   // given:
  //   // go there
  //   driver.get(`${frontEndLocation}`)
  //
  //   // when:
  //   // fill in auther field
  //   // fill in body field
  //   // hit submit
  //   driver.findElement({css: "#author-field input"})
  //   .sendKeys("Churchill")
  //   driver.findElement({css: "#body-field input"})
  //   .sendKeys("never waste a good crisis")
  //   driver.findElement({css: "input[type=submit]"})
  //   .click()
  //
  //   // then:
  //   // see the post in the list of entries
  //   driver.wait(until.elementLocated({css: ".entry[data-id='4']"}))
  //   driver.findElement({css: ".entry[data-id='4'] h3"}).getText()
  //   .then(function(header){
  //     assert.include(header, "Churchill")
  //   })
  //   driver.findElement({css: ".entry[data-id='4'] .entry-body"}).getText()
  //   .then(function(body){
  //     assert.equal(body, "never waste a good crisis")
  //   })
  // })
});

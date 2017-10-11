/*var assert = require('assert');
describe('test direct use api', function() {
    it('should pass', function() {
        var webdriverio = require('webdriverio');
        var options = {
            desiredCapabilities: {
                browserName: 'firefox',
                acceptInsecureCerts: true
            }
        };
        var client = webdriverio.remote(options);
        client
            .init()
            .url('https://www.google.com.tw')
            .getTitle().then(function(title) {
                console.log("");
                console.log('Title is: ' + title);
                console.log("");
                // outputs:
                // "Title is: WebdriverIO (Software) at DuckDuckGo"
            })
            .setValue('#lst-ib', 'WebdriverIO')
            //.click('#search_button_homepage')
            .saveScreenshot('./snapshot.png')
            .end();
        assert.equal("123", "123");
    });
});*/

describe('https://www.google.com title', function () {
    it('should include Google', function () {
        console.log("");
        console.log(browser.desiredCapabilities);
        console.log("");

        browser.url('https://www.google.com');

        takeScreenshot('my_screenshot_01.png');

        // browser.setValue("[id='docsearch'] input", '_TEST_');
        browser.setValue("input[name='q']", '_TEST_');

        takeScreenshot('my_screenshot_02.png');

        //browser.click("[id='148672306_1080746172']");

        //browser.waitForExist("[id='endpage-rebrand_ep_form_intl']");

        var title = browser.getTitle();
        console.log("Title = " + title);
        console.log("");
        browser.getTitle().should.equal(title);
        browser.getTitle().should.include("Google");
    });
    it('test for error case', function () {
        browser.getTitle().should.include("_TEST_");
    });
});

/*var assert = require('assert');
describe('webdriver.io page', function() {
    it('should have the right title - the fancy generator way', function() {
        browser.url('http://webdriver.io');
        var title = browser.getTitle();
        assert.equal(title, 'WebdriverIO - WebDriver bindings for Node.js');
    });
});*/


/*var expect = require('chai').expect;
describe('webdriver.io api page', function() {
    it('should be able to filter for commands', function() {
        browser.url('http://webdriver.io/api.html');
        // filtering property commands
        $('.searchbar input').setValue('getT');
        // get all results that are displayed
        var results = $$('.commands.property a').filter(function(link) {
            return link.isVisible();
        });
        // assert number of results
        expect(results.length).to.be.equal(3);
        // check out second result
        results[1].click();
        expect($('.doc h1').getText()).to.be.equal('GETTEXT');
    });
});*/
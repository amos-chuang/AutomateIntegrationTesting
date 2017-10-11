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
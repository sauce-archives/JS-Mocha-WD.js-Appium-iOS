var makeSuite = require('./helpers').makeSuite;

makeSuite('Test Suite Comments', function() {

    it('enter comments, submit and read back correctly', function(done) {
        driver
            .elementById('comments')
            .sendKeys('I am a comment!')
            .elementById('H1Text')
            .click()
            .elementById('submit')
            .click()
            .elementById('comments')
            .getValue().should.eventually.equal('')
            .nodeify(done);
    });

});

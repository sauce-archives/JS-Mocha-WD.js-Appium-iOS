var makeSuite = require('./helpers').makeSuite;

makeSuite('Test Suite Email', function() {

  it('enter and read email back correctly', function(done) {
    driver
        .elementById('fbemail')
        .sendKeys('hello@world.com')
        .elementById('fbemail')
        .getValue().should.eventually.equal('hello@world.com')
        .nodeify(done);
  });

});

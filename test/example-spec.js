var makeSuite = require('./helpers').makeSuite;

makeSuite('Test Suite 2', function() {

  it('should compute different sum', function() {
    driver
      .elementByAccessibilityId('TextField1')
      .sendKeys(13)
      .elementByClassName('UIATextField')
      .sendKeys(8)
      .elementByAccessibilityId('ComputeSumButton')
      .click()
      .elementByClassName('UIAStaticText')
        .should.eventually.equal(21);
  });

});

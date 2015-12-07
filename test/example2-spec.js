var makeSuite = require('./helpers').makeSuite;

makeSuite('Test Suite 1', function() {

  it('should compute a sum', function() {
    driver
      .elementByAccessibilityId('TextField1')
      .sendKeys(12)
      .elementByClassName('UIATextField')
      .sendKeys(8)
      .elementByAccessibilityId('ComputeSumButton')
      .click()
      .elementByClassName('UIAStaticText')
        .should.eventually.equal(20);
  });

});

var wd = require('wd'),
    _ = require("lodash"),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

wd.configureHttp({
    timeout: 240000,
    retryDelay: 15000,
    retries: 5
});

function beforeEachExample(done) {
    var username = process.env.SAUCE_USERNAME;
    var accessKey = process.env.SAUCE_ACCESS_KEY;
    driver = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);

    driver
        .init({
            name: this.currentTest.title,
            browserName: '',
            appiumVersion: '1.4.13',
            deviceName: process.env.deviceName,
            platformVersion: process.env.platformVersion,
            platformName: process.env.platformName,
            app: process.env.app
        })
        .nodeify(done);
};

function afterEachExample(done) {
    // allPassed = allPassed && (this.currentTest.state === 'passed');
    driver
        .quit()
        .sauceJobStatus(true)
        .nodeify(done);
};

function makeSuite(desc, cb) {
    describe(desc, function() {
        var driver;

        this.timeout(240000);

        beforeEach(beforeEachExample);
        cb();
        afterEach(afterEachExample);
    });
};

exports.makeSuite = makeSuite;

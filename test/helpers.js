var wd = require('wd'),
    _ = require("lodash"),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    path = require("path");

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
            appiumVersion: '1.5.3',
            deviceName: process.env.deviceName,
            platformVersion: process.env.platformVersion,
            platformName: process.env.platformName,
            app: "sauce-storage:" + process.env.app
        })
        .nodeify(done);
};

function afterEachExample(done) {
    // allPassed = allPassed && (this.currentTest.state === 'passed');
    driver
        .quit()
        .sauceJobStatus(this.currentTest.state === 'passed')
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

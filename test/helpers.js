var wd = require('wd'),
    _ = require("lodash"),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    uploadToSauceStorage = require("./sauce-utils").uploadFileToSauceStorage,
    path = require("path");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

wd.configureHttp({
    timeout: 240000,
    retryDelay: 15000,
    retries: 5
});

function beforeAll(done){
    uploadToSauceStorage(path.resolve("./resources/GuineaPig-dev-debug.app.zip"))
        .then( function(res) {
            if (res) {
                uploadToSauceStorage(path.resolve("./resources/GuineaPig-dev-debug.app.zip")).then( function(res2) {
                    if (res2) {
                        done();
                    } else {
                        process.exit(-1);
                    }
                });
            } else {
                console.error("Device app upload failed!")
                process.exit(-1);
            }
        });
}

function beforeEachExample(done) {
    var username = process.env.SAUCE_USERNAME;
    var accessKey = process.env.SAUCE_ACCESS_KEY;
    driver = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);

    driver
        .init({
            name: this.currentTest.title,
            browserName: '',
            appiumVersion: '1.5.0',
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
        .sauceJobStatus(this.currentTest.state === 'passed')
        .nodeify(done);
};

function makeSuite(desc, cb) {
    describe(desc, function() {
        var driver;

        this.timeout(240000);

        before(beforeAll);
        beforeEach(beforeEachExample);
        cb();
        afterEach(afterEachExample);
    });
};

exports.makeSuite = makeSuite;

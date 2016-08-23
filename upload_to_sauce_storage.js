var request = require("request"),
    util = require("util"),
    fs = require("fs"),
    file = process.env.appPath,
    fileName = file.replace(/^.*[\\\/]/, ''),
    uriTemplate = "https://saucelabs.com/rest/v1/storage/%s/%s?overwrite=true",
    uri = util.format(uriTemplate, process.env.SAUCE_USERNAME, fileName);

fs.createReadStream(file).pipe(request.post({
        url: uri,
        auth: {
            user: process.env.SAUCE_USERNAME,
            pass: process.env.SAUCE_ACCESS_KEY,
        },
    },
    function (error, response, body) {
        if (error) {
            console.error("Upload failed:", error);
        } else {
            console.log("Upload successful!  Server responded with:", body);
        }
    })
);

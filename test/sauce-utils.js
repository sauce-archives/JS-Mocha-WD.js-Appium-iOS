var request = require("request");
var util = require("util");
var fs = require("fs");
var crypto = require('crypto');

function getMD5(file) {
  return new Promise( function(resolve, reject) {
    try{
          var hash = crypto.createHash('md5');
          var stream = fs.createReadStream(file);
          stream.on('data',  function(data){
            hash.update(data, 'utf8')
          });

          stream.on('end',  function() {
            resolve(hash.digest('hex')); 
          });
        } catch (e) {
          reject(e);
        }
  });
}

function getFilename(path) {
    return new Promise( function(resolve, reject) {
        try{ 
            resolve(path.replace(/^.*[\\\/]/, ''));
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

function uploadToSS(file) {
    return new Promise( function(resolve, reject) {
        try{

            getFilename(file)
                .then( function(fileName) {
                    var uriTemplate = "https://saucelabs.com/rest/v1/storage/%s/%s?overwrite=true";
                    var uri = util.format(uriTemplate, process.env.SAUCE_USERNAME, fileName)
                    //console.log(uri);
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
                            resolve(error);
                        } else {
                            //console.log("Upload successful!  Server responded with:", body);
                            resolve(JSON.parse(body)["md5"]);
                        }
                    }));
                });
        } catch (e) {
            reject(e);
        }
    });
}


function uploadFileToSauceStorage(file){
    return new Promise(function(resolve, reject) {
        try{
            uploadToSS(file).then( function(md5) {
                getMD5(file).then( function(localMd5) {
                    if (localMd5 === md5){
                        //console.log("Upload confirmed!");
                        resolve(true);
                    } else {
                        console.error("Checksum failed!");
                        resolve(false);
                    }
                });
            });
        } catch (e){
            console.error(e);
            reject(e);
        }
    });
}

exports.uploadFileToSauceStorage = uploadFileToSauceStorage;

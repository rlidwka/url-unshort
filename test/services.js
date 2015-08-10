
'use strict';


var async   = require('async');
var YAML    = require('js-yaml');
var fs      = require('fs');
var request = require('request');
var urls    = YAML.safeLoad(fs.readFileSync(__dirname + '/services.yml', 'utf8'));
var uu      = require('../')();


describe('Services', function () {

  it('should expand url', function (callback) {
    async.mapLimit(urls, 10, function (url, next) {
      uu.expand(url, function (err, result) {
        if (err) {
          next(null, new Error(url + ' - ' + err.message));
          return;
        }

        if (result !== 'https://github.com/nodeca/url-unshort') {
          next(null, new Error(url + ' - unexpected result: ' + result));
          return;
        }

        next();
      });
    }, function (_err, results) {
      callback(results.filter(Boolean).join('\n') || null);
    });
  });

});

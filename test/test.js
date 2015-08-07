
'use strict';


var async   = require('async');
var YAML    = require('js-yaml');
var fs      = require('fs');
var request = require('request');
var urls    = YAML.safeLoad(fs.readFileSync(__dirname + '/test.yml', 'utf8'));
var uu      = require('../')();


async.each(urls, function (url, next) {
  uu.expand(url, function (err, result) {
    if (err) {
      next(err);
      return;
    }

    console.log('%s -> %s',
      url + Array(Math.max(1, 32 - url.length)).join(' '),
      result);

    next();
  });
});

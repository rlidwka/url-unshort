// This rule should handle 3xx responses from most of the shorteners
// out there, since shorteners are usually based on the HTTP redirects.
//
// Twitter sends different responses to different user agents,
// curl receives 301, but browsers receive 200 + <meta http-equiv="refresh">
//
// TinyURL mostly return 301, but I've been receiving weird stuff on the
// popular links, `curl -i http://tinyurl.com/8kmfp` (200 + meta + ad scripts)
//
// Other services send 301/302 with a body (e.g. Google, Bit.ly, Bit.do)
// or without it (e.g. Ow.ly).
//
// examples:
//  - https://goo.gl/HwUfwd
//  - http://bit.ly/1gMSVzZ
//  - http://bit.do/9ZiH
//  - https://t.co/DD3MKQZtXj
//  - https://tinyurl.com/nzezbl8
//

'use strict';


var fs      = require('fs');
var path    = require('path');
var request = require('request');
var yaml    = require('js-yaml');
var config  = path.join(__dirname, 'default.yml');


exports.domains = yaml.safeLoad(fs.readFileSync(config, 'utf8'));


exports.fetch = function (url, callback) {
  request({
    method: 'HEAD',
    url: url,
    followRedirect: false,
    headers: {
      'User-Agent': 'https://github.com/nodeca/url-unshort'
    }
  }, function (err, res) {
    if (err) {
      callback(err);
      return;
    }

    if (!(res.statusCode >= 300 && res.statusCode < 400)) {
      callback();
      return;
    }

    callback(null, res.headers.location);
  });
};

// Main class
//

'use strict';


var URL        = require('url');
var path       = require('path');
var requireAll = require('require-all');
var Cache      = require('./cache');


// Create an unshortener instance
//
// options:
//  - cache (Object) - cache instance, default: `new Cache()`
//  - depth (Number) - max amount of redirects to follow, default: `2`
//
function Unshort(options) {
  if (!(this instanceof Unshort)) {
    return new Unshort(options);
  }

  var self = this;
  var providers = requireAll(path.join(__dirname, 'providers'));

  options = options || {};

  this._domains = {};
  this._cache = options.cache || new Cache();

  Object.keys(providers).forEach(function (name) {
    self.addDomain(providers[name].domains, { fetch: providers[name].fetch });
  });
}


// Expand an URL
//
//  - url      (String)   - url to expand
//  - callback (Function) - `function (err, fullUrl)`
//
Unshort.prototype.expand = function (url, callback) {
  var self = this;

  self._cache.get(url, function (err, result) {
    if (err) {
      callback(err);
      return;
    }

    if (result) {
      callback(null, result);
      return;
    }

    var u = URL.parse(url);

    if (u.protocol && u.protocol !== 'http:' && u.protocol !== 'https:') {
      callback();
      return;
    }

    var domainConfig = {};
    var host = u.hostname;

    if (self._domains[host] && self._domains[host].match.test(u.path)) {
      domainConfig = self._domains[host];
    } else if (self._domains['*'] && self._domains['*'].match.test(u.path)) {
      domainConfig = self._domains['*'];
    }

    if (!domainConfig.fetch) {
      callback();
      return;
    }

    domainConfig.fetch(url, function (err, result) {
      if (err) {
        callback(err);
        return;
      }

      self._cache.set(url, result, function (err) {
        if (err) {
          callback(err);
          return;
        }

        callback(null, result);
      });
    });
  });
};


// Add a domain name to the list of known domains
//
//  - domains (String|Array) - list of domain names
//  - options (Object)       - options for these domains
//    - match    (RegExp)      - additional match performed on path
//    - fetch    (Function)    - custom function to retrieve expanded url
//
Unshort.prototype.addDomain = function (domains, options) {
  var self = this;

  if (!Array.isArray(domains)) {
    domains = [ domains ];
  }

  options = options || {};

  domains.forEach(function (domain) {
    self._domains[domain] = {
      // by default, only ignore '/' paths
      match: options.match || /^\/[^#]/,
      fetch: options.fetch
    };
  });
};


module.exports = Unshort;

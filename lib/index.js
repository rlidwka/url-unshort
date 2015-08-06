// Main class
//

'use strict';


// Create an unshortener instance
//
// options:
//  - cache   (Object)  - cache instance, default: `new Cache()`
//  - offline (Boolean) - cache-only mode, default: `false`
//  - depth   (Number)  - max amount of redirects to follow, default: `2`
//
function Unshort(options) {
  
}


// Expand an URL
//
//  - url      (String)   - url to expand
//  - callback (Function) - `function (err, fullUrl)`
//
Unshort.prototype.unshorten = function (url, callback) {
  
};


// Add a domain name to the list of known domains
//
//  - domains (String|Array) - list of domain names
//  - options (Object)       - options for these domains
//    - match    (RegExp)      - additional match performed on path
//    - fetch    (Function)    - custom function to retrieve expanded url
//
Unshort.prototype.addDomain = function (domains, options) {

};


module.exports = Unshort;

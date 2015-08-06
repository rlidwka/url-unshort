// Simple cache implementation that stores all data in memory
//

'use strict';


// Create a cache instance
//
function Cache() {
  this._data = {};
}


// Get a stored value by its key
//
Cache.prototype.get = function (key, callback) {
  callback(null, this._data[key]);
};


// Store a value to the cache
//
Cache.prototype.set = function (key, value, callback) {
  this._data[key] = value;
  callback();
};


module.exports = Cache;

# url-unshort

[![Build Status](https://img.shields.io/travis/nodeca/url-unshort/master.svg?style=flat)](https://travis-ci.org/nodeca/url-unshort)
[![NPM version](https://img.shields.io/npm/v/url-unshort.svg?style=flat)](https://www.npmjs.org/package/url-unshort)

> This library expands urls provided by url shortening services like `tinyurl` or `bit.ly`.

## Why should I use it?

It has been [argued](http://joshua.schachter.org/2009/04/on-url-shorteners) that “shorteners are bad for the ecosystem as a whole”. In particular, if you're running a forum or a blog, such services might cause trouble for your users:

 - such links load slower than usual (shortening services require an extra DNS and HTTP request)
 - it adds another point of failure (should this service go down, the links will die; [301works](https://archive.org/details/301works) tries to solve this, but it's better to avoid the issue in the first place)
 - users don't see where the link points to (tinyurl previews don't *really* solve this)
 - it can be used for user activity tracking
 - certain shortening services are displaying ads before redirect
 - shortening services can be malicious or be hacked so they could redirect to a completely different place next month

Also, short links are used to bypass the spam filters. So if you're implementing a domain black list for your blog comments, you might want to check where all those short links *actually* point to.

## Installation

```js
$ npm install url-unshort
```

## Basic usage

```js
uu.expand('http://goo.gl/HwUfwd', function (err, url) {
  // connection error or similar
  if (err) throw err;

  if (url) {
    console.log(`Original url is: ${url}`);
  } else {
    // no shortening service or an unknown one is used
    console.log(`This url can't be expanded`);
  }
});
```

## API

### Creating an instance

When you create an instance, you can pass an options object to fine-tune unshortener behavior.

```js
var uu = require('url-unshort')({
  depth: 2,
  cache: {
    get: function (key, callback) {},
    set: function (key, value, callback) {}
  },
});
```

Available options are:

 - `depth` (Number, default: `2`) - stop resolving urls when `depth` amount of redirects is reached.

   It happens if one shortening service refers to a link belonging to another shortening service which in turn points to yet another one and so on.

   If this limit is reached, `expand()` will return an error.

 - `cache` (Object) - override a built-in cache with a custom cache implementation.

   `url-unshort` stores all successfully retrieved links into a in-memory cache which is discarded when process exits. If you want the results to persist, you can override this object with a custom implementation (e.g. redis).

   You need to specify two async functions, `set(key, value, callback)` for `url-unshort` to set a value and `get(key, callback)` to get it back.

### uu.expand(url, callback)

Expand an URL supplied. If we don't know how to expand it, callback returns `null`.

```js
uu.expand('http://goo.gl/HwUfwd', function (err, url) {
  // connection error or similar
  if (err) throw err;

  if (url) {
    console.log(`Original url is: ${url}`);
  } else {
    // no shortening service or an unknown one is used
    console.log(`This url can't be expanded`);
  }
});
```

### uu.addDomain(domain [, options])

Add a new url shortening service (domain name or an array of them) to the white list of domains we know how to expand.

If domain name is already added, its configuration gets overwritten.

```js
uu.addDomain([ 'tinyurl.com', 'bit.ly' ]);
```

The default behavior will be to follow the URL with a HEAD request and check the status code. If it's `3xx`, return the `Location` header. You can override this behavior by supplying your own function in options.

If you want to enable this behavior for all links (i.e. fetch all links no matter what domain it is), you can add `*` instead:

```js
uu.addDomain('*');
```

Options:

 - `match` (RegExp) - perform an additional pattern match on path (default: `/^\/[^#]/`)
 - `fetch` (Function) - specify a custom function to retrieve expanded url

So a full-featured example of adding a domain would look like this:

```js
uu.addDomain('goo.gl', {
  match: /^\/[a-z0-9]+$/i,
  fetch: function (url, callback) {
    require('request')({
      method: 'HEAD',
      url: url,
      followRedirect: false,
    }, function (err, res, body) {
      if (err) return callback(err);

      if (res.statusCode >= 300 && res.statusCode < 400) {
        return callback(null, res.headers.location);
      } else {
        return callback();
      }
    });
  },
});
```

## Security considerations

*TODO*

 - allowed protocols (browser happily redirects to `skype:foo`)
 - redirect loop
 - assertion about well-formed urls

## License

[MIT](https://raw.github.com/nodeca/url-unshort/master/LICENSE)

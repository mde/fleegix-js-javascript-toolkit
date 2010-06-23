/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }

if (typeof $ == 'undefined') {
  // Don't want hoisting -- don't declare with var
  $ = function (s) { return document.getElementById(s); };
}

var $elem = function (s, o) {
  var opts = o || {};
  var elem = document.createElement(s);
  for (var p in opts) {
    elem[p] = opts[p];
  }
  return elem;
};

var $text = function (s) {
  return document.createTextNode(s);
};

fleegix.bind = function (func, context) {
  return function () {
    func.apply(context, arguments);
  };
};

fleegix.extend = function (/* Super-class constructor function */ superClass,
  /* Sub-class constructor function */ subClass) {
  return function () {
    superClass.apply(this, arguments);
    superClass.prototype.constructor.apply(this, arguments);
    subClass.apply(this, arguments);
    this.superClass = superClass;
    this.subClass = subClass;
  };
};

fleegix.mixin = function (/* Target obj */ target,
  /* Obj of props or constructor */ mixin, /* Deep-copy flag */ recurse) {
  // Create an instance if we get a constructor
  var m;
  if (typeof mixin == 'function') {
    m = new mixin();
  }
  else {
    m = mixin;
  }
  var baseObj = {};
  for (var p in m) {
    // Don't copy anything from Object.prototype
		if (typeof baseObj[p] == 'undefined' || baseObjj[p] != m[p]) {
      if (recurse && typeof m[p] == 'object' && m[p] !== null && !m[p] instanceof Array) {
        fleegix.mixin(target[p], m[p], recurse);
      }
      else {
        target[p] = m[p];
      }
    }
  }
  return target;
};

// Note this doesn't check for cyclical references
fleegix.clone = function (o) {
  if (typeof o == 'object') {
    var ret;
    if (typeof o.constructor == 'function') {
      ret = new o.constructor();
    }
    else {
      ret = {};
    }
    for (var p in o) {
      if (typeof o[p] == 'object' && o[p] !== null) {
        ret[p] = fleegix.clone(o[p]);
      }
      else {
        ret[p] = o[p];
      }
    }
  }
  else {
    ret = o;
  }
  return ret;
};

if (typeof navigator != 'undefined') {
  fleegix.ua = new function () {
    var ua = navigator.userAgent;
    var majorVersion = function (ua, re) {
      var m = re.exec(ua);
      if (m && m.length > 1) {
        m = m[1].substr(0, 1);
        if (!isNaN(m)) {
          return parseInt(m);
        }
        else {
          return null;
        }
      }
      return null;
    };
    // Layout engines
    this.isWebKit= ua.indexOf("AppleWebKit") > -1;
    this.isKHTML = ua.indexOf('KHTML') > -1;
    this.isGecko = ua.indexOf('Gecko') > -1 &&
      !this.isWebKit && !this.isKHTML;

    // Browsers
    this.isOpera = ua.indexOf("Opera") > -1;
    this.isChrome = ua.indexOf("Chrome") > -1;
    this.isSafari = ua.indexOf("Safari") > -1 && !this.isChrome;
    // Firefox, Camino, 'Iceweasel/IceCat' for the freetards
    this.isFF = ua.indexOf('Firefox') > -1 ||
      ua.indexOf('Iceweasel') > -1 || ua.indexOf('IceCat') > -1;
    this.isFirefox = this.isFF; // Alias
    this.isIE = ua.indexOf('MSIE ') > -1 && !this.isOpera;

    // Mobiles
    this.isIPhone = ua.indexOf("iPhone") > -1;
    this.isMobile = this.isIPhone || ua.indexOf("Opera Mini") > -1;

    // OS's
    this.isMac = ua.indexOf('Mac') > -1;
    this.isUnix = ua.indexOf('Linux') > -1 ||
      ua.indexOf('BSD') > -1 || ua.indexOf('SunOS') > -1;
    this.isLinux = ua.indexOf('Linux') > -1;
    this.isWindows = ua.indexOf('Windows') > -1 || ua.indexOf('Win');

    // Major ua version
    this.majorVersion = null;
    var reList = {
      FF: /Firefox\/([0-9\.]*)/,
      Safari: /Version\/([0-9\.]*) /,
      IE: /MSIE ([0-9\.]*);/,
      Opera: /Opera\/([0-9\.]*) /,
      Chrome: /Chrome\/([0-9\.]*)/
    }
    for (var p in reList) {
      if (this['is' + p]) {
        this.majorVersion = majorVersion(ua, reList[p]);
      }
    }

    // Add to base fleegix obj for backward compat
    for (var p in this) {
      fleegix[p] = this[p];
    }
  };
}


fleegix.cookie = new function() {
  this.set = function(name, value, optParam) {
    var opts = optParam || {};
    var path = '/';
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var exp = '';
    var t = 0;
    if (typeof optParam == 'object') {
      path = opts.path || '/';
      days = opts.days || 0;
      hours = opts.hours || 0;
      minutes = opts.minutes || 0;
    }
    else {
      path = optParam || '/';
    }
    t += days ? days*24*60*60*1000 : 0;
    t += hours ? hours*60*60*1000 : 0;
    t += minutes ? minutes*60*1000 : 0;

    if (t) {
      var dt = new Date();
      dt.setTime(dt.getTime() + t);
      exp = '; expires=' + dt.toGMTString();
    }
    else {
      exp = '';
    }
    document.cookie = name + '=' + value +
      exp + '; path=' + path;
  };
  this.get = function(name) {
    var nameEq = name + '=';
    var arr = document.cookie.split(';');
    for(var i = 0; i < arr.length; i++) {
      var c = arr[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEq) === 0) {
        return c.substring(nameEq.length, c.length);
      }
    }
    return null;
  };
  this.create = this.set;
  this.destroy = function(name, path) {
    var opts = {};
    opts.minutes = -1;
    if (path) { opts.path = path; }
    this.set(name, '', opts);
  };
};


fleegix.form = {};
/**
 * Serializes the data from all the inputs in a Web form
 * into a query-string style string.
 * @param f -- Reference to a DOM node of the form element
 * @param opts -- JS object of options for how to format
 * the return string. See fleegix.url.objectToQS for usage.
 * @returns query-string style String of variable-value pairs
 */
fleegix.form.serialize = function (f, opts) {
  var h = fleegix.form.toObject(f, opts);
  if (typeof fleegix.url == 'undefined') {
    throw new Error('fleegix.form.serialize depends on the fleegix.url module.');
  }
  var str = fleegix.url.objectToQS(h, opts);
  return str;
};

/**
 * Converts the values in an HTML form into a JS object
 * Elements with multiple values like sets of radio buttons
 * become arrays
 * @param f -- HTML form element to convert into a JS object
 * @param o -- JS Object of options:
 *    pedantic: (Boolean) include the values of elements like
 *      button or image
 *    hierarchical: (Boolean) if the form is using Rails-/PHP-style
 *      name="foo[bar]" inputs, setting this option to
 *      true will create a hierarchy of objects in the
 *      resulting JS object, where some of the properties
 *      of the objects are sub-objects with values pulled
 *      from the form. Note: this only supports one level
 *      of nestedness
 * hierarchical option code by Kevin Faulhaber, kjf@kjfx.net
 * @returns JavaScript object representation of the contents
 * of the form.
 */
fleegix.form.toObject= function (f, o) {
  var opts = o || {};
  var h = {};
  function expandToArr(orig, val) {
    if (orig) {
      var r = null;
      if (typeof orig == 'string') {
        r = [];
        r.push(orig);
      }
      else { r = orig; }
      r.push(val);
      return r;
    }
    else { return val; }
  }

  for (var i = 0; i < f.elements.length; i++) {
    var elem = f.elements[i];
    // Elements should have a name
    if (elem.name) {
      var st = elem.name.indexOf('[');
      var sp = elem.name.indexOf(']');
      var sb = '';
      var en = '';
      var c;
      var n;
      // Using Rails-/PHP-style name="foo[bar]"
      // means you can go hierarchical if you want
      if (opts.hierarchical && (st > 0) && (sp > 2)) {
          sb = elem.name.substring(0, st);
          en = elem.name.substring(st + 1, sp);
          if (typeof h[sb] == 'undefined') { h[sb] = {}; }
          c = h[sb];
          n = en;
      }
      else {
          c = h;
          n = elem.name;
      }
      switch (elem.type) {
        // Text fields, hidden form elements, etc.
        case 'text':
        case 'hidden':
        case 'password':
        case 'textarea':
        case 'select-one':
          c[n] = elem.value;
          break;
        // Multi-option select
        case 'select-multiple':
          for(var j = 0; j < elem.options.length; j++) {
            var e = elem.options[j];
            if(e.selected) {
              c[n] = expandToArr(c[n], e.value);
            }
          }
          break;
        // Radio buttons
        case 'radio':
          if (elem.checked) {
            c[n] = elem.value;
          }
          break;
        // Checkboxes
        case 'checkbox':
          if (elem.checked) {
            c[n] = expandToArr(c[n], elem.value);
          }
          break;
        // Pedantic
        case 'submit':
        case 'reset':
        case 'file':
        case 'image':
        case 'button':
          if (opts.pedantic) { c[n] = elem.value; }
          break;
      }
    }
  }
  return h;
};
// Alias for backward compat
fleegix.form.toHash = fleegix.form.toObject;

fleegix.json = new function() {
  // Escaping control chars, etc.
  // Source:  Crockford's excellent JSON2
  // http://json.org/json2.js -- License: public domain
  var _cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var _escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var _meta = {    // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
  };
  var _quote = function (str) {
      _escapable.lastIndex = 0;
      return _escapable.test(str) ?
        '"' + str.replace(_escapable, function (a) {
          var c = _meta[a];
          return typeof c === 'string' ? c :
              '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' :
        '"' + str + '"';
  };
  this.serialize = function(obj) {
    var str = '';
    switch (typeof obj) {
      case 'object':
        switch (true) {
          // Null
          case obj === null:
            return 'null';
            break;
          // Arrays
          case obj instanceof Array: 
            for (var i = 0; i < obj.length; i++) {
              if (str) { str += ','; }
              str += fleegix.json.serialize(obj[i]);
            }
            return '[' + str + ']';
            break;
          // Exceptions don't serialize correctly in Firefox
          case (fleegix.isFF && obj instanceof DOMException):
            str += '"' + obj.toString() + '"';
            break;
          // All other generic objects
          case typeof obj.toString != 'undefined':
            for (var i in obj) {
              if (str) { str += ','; }
              str += '"' + i + '":';
              if (typeof obj[i] == 'undefined') {
                str += '"undefined"';
              }
              else {
                str += fleegix.json.serialize(obj[i]);
              }
            }
            return '{' + str + '}';
            break;
        }
        return str;
      case 'unknown':
      case 'undefined':
      case 'function':
        return '"undefined"';
      case 'string':
        str += _quote(obj);
        return str;
      default:
        return String(obj);
    }
  };
  // Credits: Crockford's excellent json2 parser
  // http://json.org/json2.js -- License: public domain
  this.parse = function (text, reviver) {
      var j;
      function walk(holder, key) {
          var k, v, value = holder[key];
          if (value && typeof value === 'object') {
              for (k in value) {
                  if (Object.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                          value[k] = v;
                      } else {
                          delete value[k];
                      }
                  }
              }
          }
          return reviver.call(holder, key, value);
      }
      _cx.lastIndex = 0;
      if (_cx.test(text)) {
          text = text.replace(_cx, function (a) {
              return '\\u' +
                  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });
      }
      if (/^[\],:{}\s]*$/.
        test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
          j = eval('(' + text + ')');
          return typeof reviver === 'function' ?
              walk({'': j}, '') : j;
      }
      throw new SyntaxError('JSON not parseable.');
  };
};


fleegix.string = new function () {
  // Regexes used in trimming functions
  var _LTR = /^\s+/;
  var _RTR = /\s+$/;
  var _TR = /^\s+|\s+$/g;
  // From/to char mappings -- for the XML escape,
  // unescape, and test for escapable chars
  var _CHARS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;'
  };
  // Builds the escape/unescape methods using a common
  // map of characters
  var _buildEscapes = function (direction) {
    return function (str) {
      s = str;
      var fr, to;
      for (var p in _CHARS) {
        fr = direction == 'to' ? p : _CHARS[p];
        to = direction == 'to' ? _CHARS[p] : p;
        s = s.replace(new RegExp(fr, 'gm'), to);
      }
      return s;
    };
  };
  // Builds a method that tests for any of the escapable
  // characters -- useful for avoiding double-escaping if
  // you're not sure whether a string is already escaped
  var _buildEscapeTest = function (direction) {
    return function (s) {
      var pat = '';
      for (var p in _CHARS) {
        pat += direction == 'to' ? p : _CHARS[p];
        pat += '|';
      }
      pat = pat.substr(0, pat.length - 1);
      pat = new RegExp(pat, "gm");
      return pat.test(s);
    };
  };
  // Escape special chars to entities
  this.escapeXML = _buildEscapes('to');
  // Unescape entities to special chars
  this.unescapeXML = _buildEscapes('from');
  // Test if a string includes special chars that
  // require escaping
  this.needsEscape = _buildEscapeTest('to');
  this.needsUnescape = _buildEscapeTest('from');
  this.toArray = function (str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr[i] = str.substr(i, 1);
    }
    return arr;
  };
  this.reverse = function (str) {
    return this.toArray(str).reverse().join('');
  };
  this.ltrim = function (str, chr) {
    var pat = chr ? new RegExp('^' + chr + '+') : _LTR;
    return str.replace(pat, '');
  };
  this.rtrim = function (str, chr) {
    var pat = chr ? new RegExp(chr + '+$') : _RTR;
    return str.replace(pat, '');
  };
  this.trim = function (str, chr) {
    var pat = chr ? new RegExp('^' + chr + '+|' + chr + '+$', 'g') : _TR;
    return str.replace(pat, '');
  };
  this.lpad = function (str, chr, width) {
    var s = str;
    while (s.length < width) {
      s = chr + s;
    }
    return s;
  };
  this.rpad = function (str, chr, width) {
    var s = str;
    while (s.length < width) {
      s = s + chr;
    }
    return s;
  };
  // Converts someVariableName to some_variable_name
  this.toLowerCaseWithUnderscores = function (s) {
    return s.replace(/([A-Z]+)/g, '_$1').toLowerCase().
      replace(/^_/, '');
  };
  // Alias for above
  this.deCamelize = function (s) {
    return this.toLowerCaseWithUnderscores(s);
  };
  // Converts some_variable_name to someVariableName
  this.toCamelCase = function (s) {
    return s.replace(/_[a-z]{1}/g, function (s)
      { return s.replace('_', '').toUpperCase() });
  };
  // Alias for above
  this.camelize = function (s) {
    return this.toCamelCase(s);
  };
  this.capitalize = function (s) {
    return s.substr(0, 1).toUpperCase() + s.substr(1);
  };
};



fleegix.url = new function () {
  // Private vars
  var _this = this;
  var _QS = '\\?|;';
  var _QS_SIMPLE = new RegExp(_QS);
  var _QS_CAPTURE = new RegExp('(' + _QS + ')');

  // Private function, used by both getQSParam and setQSParam
  var _changeQS = function (mode, str, name, val) {
    var match = _QS_CAPTURE.exec(str);
    var delim;
    var base;
    var query;
    var obj;
    var s = '';
    // If there's a querystring delimiter, save it
    // for reinsertion into the return value
    if (match && match.length > 0) {
      delim = match[0];
    }
    // Delimiter -- entire URL, need to decompose
    if (delim) {
      base = _this.getBase(str);
      query = _this.getQS(str);
    }
    // Just a querystring passed
    else {
      query = str;
    }
    obj = _this.qsToObject(query, { arrayizeMulti: true });
    if (mode == 'set') { obj[name] = val; }
    else { delete obj[name]; }
    if (base) {
      s = base + delim;
    }
    s += _this.objectToQS(obj);
    return s;
  };
  /**
   * Convert the values in a query string (key=val&key=val) to
   * an Object
   * @param str -- A querystring
   * @param o -- JS object of options, current only includes:
   *   arrayizeMulti: (Boolean) convert mutliple instances of
   *      the same key into an array of values instead of
   *      overriding. Defaults to false.
   * @returns JavaScript key/val object with the values from
   * the querystring
   */
  this.qsToObject = function (str, o) {
    var opts = o || {};
    var d = {};
    var arrayizeMulti = opts.arrayizeMulti || false;
    if (str) {
      var arr = str.split('&');
      for (var i = 0; i < arr.length; i++) {
        var pair = arr[i].split('=');
        var name = pair[0];
        var val = decodeURIComponent(pair[1]);
        // "We've already got one!" -- arrayize if the flag
        // is set
        if (typeof d[name] != 'undefined' && arrayizeMulti) {
          if (typeof d[name] == 'string') {
            d[name] = [d[name]];
          }
          d[name].push(val);
        }
        // Otherwise just set the value
        else {
          d[name] = val;
        }
      }
    }
    return d;
  };
  /**
   * Convert a JS Object to querystring (key=val&key=val).
   * Value in arrays will be added as multiple parameters
   * @param obj -- an Object containing only scalars and arrays
   * @param o -- JS object of options for how to format
   * the return string. Supported options:
   *   collapseMulti: (Boolean) take values from elements that
   *      can return multiple values (multi-select, checkbox groups)
   *      and collapse into a single, comman-delimited value
   *      (e.g., thisVar=asdf,qwer,zxcv)
   *   stripTags: (Boolean) strip markup tags from any values
   *   includeEmpty: (Boolean) include keys in the string for
   *     all elements, even if they have no value set (e.g.,
   *     even if elemB has no value: elemA=foo&elemB=&elemC=bar)
   *   pedantic: (Boolean) include the values of elements like
   *      button or image
   *   deCamelizeParams: (Boolean) change param names from
   *     camelCase to lowercase_with_underscores
   * @returns A querystring containing the values in the
   * Object
   * NOTE: This is used by form.serialize
   */
  this.objectToQS = function (obj, o) {
    var opts = o || {};
    var str = '';
    var pat = opts.stripTags ? /<[^>]*>/g : null;
    for (var n in obj) {
      var s = '';
      var v = obj[n];
      if (v != undefined) {
        // Multiple vals -- array
        if (v.length && typeof v != 'string') {
          var sep = '';
          if (opts.collapseMulti) {
            sep = ',';
            str += n + '=';
          }
          else {
            sep = '&';
          }
          for (var j = 0; j < v.length; j++) {
            s = opts.stripTags ? v[j].replace(pat, '') : v[j];
            s = (!opts.collapseMulti) ? n + '=' + encodeURIComponent(s) :
              encodeURIComponent(s);
            str += s + sep;
          }
          str = str.substr(0, str.length - 1);
        }
        // Single val -- string
        else {
          s = opts.stripTags ? v.replace(pat, '') : v;
          str += n + '=' + encodeURIComponent(s);
        }
        str += '&';
      }
      else {
        if (opts.includeEmpty) { str += n + '=&'; }
      }
    }
    // Convert all the camelCase param names to Ruby/Python style
    // lowercase_with_underscores
    if (opts.deCamelizeParams) {
      if (!fleegix.string) {
        throw new Error(
          'deCamelize option depends on fleegix.string module.');
      }
      var arr = str.split('&');
      var arrItems;
      str = '';
      for (var i = 0; i < arr.length; i++) {
        arrItems = arr[i].split('=');
        if (arrItems[0]) {
          str += fleegix.string.deCamelize(arrItems[0]) +
            '=' + arrItems[1] + '&';
        }
      }
    }
    str = str.substr(0, str.length - 1);
    return str;
  };
  this.objectToQs = this.objectToQS; // Case-insensitive alias
  /**
   * Retrieve the value of a parameter from a querystring
   * @param str -- Either a querystring or an entire URL
   * @param name -- The param to retrieve the value for
   * @param o -- JS object of options, current only includes:
   *   arrayizeMulti: (Boolean) convert mutliple instances of
   *      the same key into an array of values instead of
   *      overriding. Defaults to false.
   * @returns The string value of the specified param from
   * the querystring
   */
  this.getQSParam = function (str, name, o) {
    var p = null;
    var q = _QS_SIMPLE.test(str) ? _this.getQS(str) : str;
    var opts = o || {};
    if (q) {
      var h = _this.qsToObject(q, opts);
      p = h[name];
    }
    return p;
  };
  this.getQsParam = this.getQSParam; // Case-insensitive alias
  /**
   * Set the value of a parameter in a querystring
   * @param str -- Either a querystring or an entire URL
   * @param name -- The param to set
   * @param val -- The value to set the param to
   * @returns  the URL or querystring, with the new value
   * set -- if the param was not originally there, it adds it.
   */
  this.setQSParam = function (str, name, val) {
    return _changeQS('set', str, name, val);
  };
  this.setQsParam = this.setQSParam; // Case-insensitive alias
  /**
   * Remove a parameter in a querystring
   * @param str -- Either a querystring or an entire URL
   * @param name -- The param to remove
   * @returns  the URL or querystring, with the parameter
   * removed
   */
  this.removeQSParam = function (str, name) {
    return _changeQS('remove', str, name, null);
  };
  this.removeQsParam = this.removeQSParam; // Case-insensitive alias
  this.getQS = function (s) {
    return s.split(_QS_SIMPLE)[1];
  };
  this.getQs = this.getQS; // Case-insensitive alias
  this.getBase = function (s) {
    return s.split(_QS_SIMPLE)[0];
  };

  this.getFileExtension = function (str) {
    var ext = null;
    var pathArr = str.split('.');
    if (pathArr.length > 1) {
      ext = pathArr[pathArr.length - 1];
    }
    return ext;
  };
};
// Backward-compat shim
fleegix.uri = new function () {
  this.getParamHash = fleegix.url.qsToObject;
  // Params are reversed, and passed-in QS is
  // optional -- defaults to local HREF for the
  // page it's defined on
  this.getParam = function (name, str) {
    var s = str || fleegix.url.getQS(document.location.href);
    return fleegix.url.getQSParam(s, name);
  };
  // Params are reversed, and passed-in QS is
  // optional -- defaults to local HREF for the
  // page it's defined on
  this.setParam = function (name, val, str) {
    var s = str || fleegix.url.getQS(document.location.href);
    return fleegix.url.setQSParam(s, name, val);
  };
  this.getQuery = fleegix.url.getQS;
  this.getBase = fleegix.url.getBase;
};


fleegix.html = new function () {
  var _createElem = function (s) {
    return document.createElement(s); };
  var _createText = function (s) {
    return document.createTextNode(s); };
  this.createSelect = function (o) {
    var sel = document.createElement('select');
    var options = [];
    var appendElem = null;

    // createSelect({ name: 'foo', id: 'foo', multi: true,
    //  options: [{ text: 'Howdy', value: '123' },
    //  { text: 'Hey', value: 'ABC' }], className: 'fooFoo' });
    appendElem = arguments[1];
    options = o.options;
    for (var p in o) {
      if (p != 'options') {
        sel[p] = o[p];
      }
    }
    // Add the options for the select
    if (options) {
      this.setSelectOptions(sel, options);
    }
    return sel;
  };

  this.setSelectOptions = function (selectElement, options){
    while (selectElement.firstChild){
       selectElement.removeChild(selectElement.firstChild);
    }
    for (var i = 0; i < options.length; i++) {
      var opt = _createElem('option');
      opt.value = options[i].value || '';
      opt.appendChild(_createText(options[i].text));
      selectElement.appendChild(opt);
      if (options[i].selected){
        selectElement.selectedIndex = i;
      }
    }
  };

  this.setSelect = function (sel, val) {
    var index = 0;
    var opts = sel.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value == val) {
        index = i;
        break;
      }
    }
    sel.selectedIndex = index;
  };

  this.createInput = function (o) {
    var input = null;
    var str = '';

    // createInput({ type: 'password', name: 'foo', id: 'foo',
    //    value: 'asdf', className: 'fooFoo' });
    // Neither IE nor Safari 2 can handle DOM-generated radio
    // or checkbox inputs -- they stupidly assume name and id
    // attributes should be identical. The solution: kick it
    // old-skool with conditional branching and innerHTML
    if ((document.all || navigator.userAgent.indexOf('Safari/41') > -1) &&
      (o.type == 'radio' || o.type == 'checkbox')) {
      str = '<input type="' + o.type + '"' +
        ' name="' + o.name + '"' +
        ' id ="' + o.id + '"';
      if (o.value) {
        str += ' value="' + o.value + '"';
      }
      if (o.size) {
        str += ' size="' + o.size + '"';
      }
      if (o.maxlength) {
        str += ' maxlength="' + o.maxlength + '"';
      }
      if (o.checked) {
        str += ' checked="checked"';
      }
      if (o.className) {
        str += ' class="' + o.className + '"';
      }
      str += '/>';

      var s = _createElem('span');
      s.innerHTML = str;
      input = s.firstChild;
      s.removeChild(input);
    }
    // Standards-compliant browsers -- all form inputs
    // IE/Safari 2 -- everything but radio button and checkbox
    else {
      input = document.createElement('input');
      for (var p in o) {
        input[p] = o[p];
      }

    }
    return input;
  };

};
/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') { fleegix = {}; }

fleegix.ejs = {};

fleegix.ejs.templateTextCache = {};

fleegix.ejs.Template = function (p) {
  var UNDEF;
  var params = p || {};

  this.mode = null;
  this.templateText = params.text ||
    // If you don't want to use Fleegix.js,
    // override getTemplateTextFromNode to use
    // textarea node value for template text
    this.getTemplateTextFromNode(params.node);
  this.afterLoaded = params.afterLoaded;
  this.source = '';
  this.markup = UNDEF;
  // Try to get from URL
  if (typeof this.templateText == 'undefined') {
    // If you don't want to use Fleegix.js,
    // override getTemplateTextFromUrl to use
    // files for template text
    this.getTemplateTextFromUrl(params);
  }
};

fleegix.ejs.Template.prototype = new function () {
  var _REGEX = /(<%%)|(%%>)|(<%=)|(<%#)|(<%)|(%>\n)|(%>)|(\n)/;
  this.modes = {
    EVAL: 'eval',
    OUTPUT: 'output',
    APPEND: 'append',
    COMMENT: 'comment',
    LITERAL: 'literal'
  };
  this.getTemplateTextFromNode = function (node) {
    // Requires the fleegix.xhr module
    if (typeof fleegix.string == 'undefined') {
      throw('Requires fleegix.string module.'); }
    var ret;
    if (node) {
      ret = node.value;
      ret = fleegix.string.unescapeXML(ret);
      ret = fleegix.string.trim(ret);
    }
    return ret;
  };
  this.getTemplateTextFromUrl = function (params) {
    // Requires the fleegix.xhr module
    if (typeof fleegix.xhr == 'undefined') {
      throw('Requires fleegix.xhr module.'); }
    var _this = this;
    var url = params.url;
    var noCache = params.preventCache || false;
    var text = fleegix.ejs.templateTextCache[url];
    // Found text in cache, and caching is turned on
    if (text && !noCache) {
      this.templateText = text;
    }
    // Otherwise go grab the text
    else {
      // Callback for setting templateText and caching --
      // used for both sync and async loading
      var callback = function (s) {
        _this.templateText = s;
        fleegix.ejs.templateTextCache[url] = s;
        // Use afterLoaded hook if set
        if (typeof _this.afterLoaded == 'function') {
          _this.afterLoaded();
        }
      };
      var opts;
      if (params.async) {
        opts = {
          url: url,
          method: 'GET',
          preventCache: noCache,
          async: true,
          handleSuccess: callback
        };
        // Get templ text asynchronously, wait for
        // loading to exec the callback
        fleegix.xhr.send(opts);
      }
      else {
        opts = {
          url: url,
          method: 'GET',
          preventCache: noCache,
          async: false
        };
        // Get the templ text inline and pass directly to
        // the callback
        text = fleegix.xhr.send(opts);
        callback(text);
      }
    }
  };
  
  this.process = function (p) {
    var params = p || {};
    this.data = params.data || {};
    var domNode = params.domNode;
    // Cache/reuse the generated template source for speed
    this.source = this.source || '';
    if (!this.source) { this.generateSource(); }

    // Eval the template with the passed data
    // Use 'with' to give local scoping to data obj props
    // ========================
    var _output = ''; // Inner scope var for eval output
    console.log(this.source);
    with (this.data) {
      eval(this.source);
    }
    this.markup = _output;

    if (domNode) {
      domNode.innerHTML = this.markup;
    }
    return this.markup;
  };
  
  this.generateSource = function () {
    var line = '';
    var matches = this.parseTemplateText();
    if (matches) {
      for (var i = 0; i < matches.length; i++) {
        line = matches[i];
        if (line) {
          this.scanLine(line);
        }
      }
    }
  };

  this.parseTemplateText = function() {
    var str = this.templateText;
    var pat = _REGEX;
    var result = pat.exec(str);
    var arr = [];
    while (result) {
      var firstPos = result.index;
      var lastPos = pat.lastIndex;
      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }
      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }
    if (str !== '') {
      arr.push(str);
    }
    return arr;
  };

  this.scanLine = function (line) {
    var li, _this = this;
    var _addOutput = function () {
      line = line.replace(/\n/g, '\\n').replace(/\r/g,
          '\\r').replace(/"/g, '\\"');
      _this.source += '_output += "' + line + '";';
    };
    switch (line) {
      case '<%':
        this.mode = this.modes.EVAL;
        break;
      case '<%=':
        this.mode = this.modes.OUTPUT;
        break;
      case '<%#':
        this.mode = this.modes.COMMENT;
        break;
      case '<%%':
        this.mode = this.modes.LITERAL;
        this.source += '_output += "' + line + '";';
        break;
      case '%>':
      case '%>\n':
        if (this.mode == this.modes.LITERAL) {
          _addOutput();
        }
        this.mode = null;
        break;
      default:
        // In script mode, depends on type of tag
        if (this.mode) {
          switch (this.mode) {
            // Just executing code
            case this.modes.EVAL:
              this.source += line + ';';
              break;
            // Exec and output
            case this.modes.OUTPUT:
              // Add the exec'd result to the output
              li = line.replace(/\s*;/, '');
              this.source += '_output += (' + li + ' || "");';
              break;
            case this.modes.COMMENT:
              // Do nothing
              break;
            // Literal <%% mode, append as raw output
            case this.modes.LITERAL:
              _addOutput();
              break;
          }
        }
        // In string mode, just add the output
        else {
          _addOutput();
        }
    }
  };
};



fleegix.xml = new function () {
  var pat = /^[\s\n\r\t]+|[\s\n\r\t]+$/g;
  var expandToArr = function (orig, val) {
    if (orig) {
      var r = null;
      if (orig instanceof Array == false) {
        r = [];
        r.push(orig);
      }
      else { r = orig; }
      r.push(val);
      return r;
    }
    else { return val; }
  };
  // Parses an XML doc or doc fragment into a JS obj
  // Values for multiple same-named tags a placed in
  // an array -- ideas for improvement to hierarchical
  // parsing from Kevin Faulhaber (kjf@kjfx.net)
  this.parse = function (node, tagName) {
    var obj = {};
    var kids = [];
    var k;
    var key;
    var t;
    var val;
    if (tagName) {
      kids = node.getElementsByTagName(tagName);
    }
    else {
      kids = node.childNodes;
    }
    for (var i = 0; i < kids.length; i++) {
      k = kids[i];
      // Element nodes (blow by the stupid Mozilla linebreak nodes)
      if (k.nodeType == 1) {
        key = k.tagName;
        // Tags with content
        if (k.firstChild) {
          // Node has only one child
          if(k.childNodes.length == 1) {
            t =  k.firstChild.nodeType;
            // Leaf nodes - text, CDATA, comment
            if (t == 3 || t == 4 || t == 8) {
              // Either set plain value, or if this is a same-named
              // tag, start stuffing values into an array
              val = k.firstChild.nodeValue.replace(pat, '');
              obj[key] = expandToArr(obj[key], val);
            }
            // Node has a single child branch node, recurse
            else if (t == 1) {
              // Rinse and repeat
              obj[key] = expandToArr(obj[key], this.parse(k.firstChild));
            }
          }
          // Node has children branch nodes, recurse
          else {
            // Rinse and repeat
            obj[key] = expandToArr(obj[key], this.parse(k));
          }
        }
        // Empty tags -- create an empty entry
        else {
          obj[key] = expandToArr(obj[key], null);
        }
      }
    }
    return obj;
  };
  // Create an XML document from string
  this.createDoc = function (str) {
    // Mozilla
    if (typeof DOMParser != "undefined") {
      return (new DOMParser()).parseFromString(str, "application/xml");
    }
    // Internet Explorer
    else if (typeof ActiveXObject != "undefined") {
      var doc = XML.newDocument( );
      doc.loadXML(str);
      return doc;
    }
    else {
      // Try loading the document from a data: URL
      // Credits: Sarissa library (sarissa.sourceforge.net)
      var url = "data:text/xml;charset=utf-8," + encodeURIComponent(str);
      var request = new XMLHttpRequest();
      request.open("GET", url, false);
      request.send(null);
      return request.responseXML;
    }
  };
  // Returns a single, top-level XML document node
  // Ideal for grabbing embedded XML data from a page
  // (i.e., XML 'data islands')
  this.getXMLDoc = function (id, tagName) {
    var arr = [];
    var doc = null;
    if (document.all) {
      var str = document.getElementById(id).innerHTML;
      doc = new ActiveXObject("Microsoft.XMLDOM");
      doc.loadXML(str);
      doc = doc.documentElement;
    }
    // Moz/compat can access elements directly
    else {
      arr =
        window.document.body.getElementsByTagName(tagName);
      doc = arr[0];
    }
    return doc;
  };
};

for (var p in fleegix) {
  exports[p] = fleegix[p];
}

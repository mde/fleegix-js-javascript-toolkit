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
  var $ = function (s) { return document.getElementById(s); };
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
  /* Obj of props or constructor */ mixin) {
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
      target[p] = m[p];
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



fleegix.fx = new function () {
  // Private functions
  function doBlind(elem, opts, dir) {
    var o = {};
    var s = 0;
    var e = 0;
    // Just clip
    if (opts.blindType == 'clip') {
      s = dir == 'down' ? 0 : elem.offsetHeight;
      e = dir == 'down' ? elem.offsetHeight : 0;
      s = [0, elem.offsetWidth, s, 0];
      e = [0, elem.offsetWidth, e, 0];
      o.props = { clip: [s, e] };
    }
    // Change actual height -- requires ending
    // height for down direction
    else {
      if (dir == 'down') {
        // Allow an explicit target height to be passed
        // to avoid touching DOM, and for speed
        if (opts.endHeight) {
            e = opts.endHeight;
        }
        // If no explicit height is passed, temporarily
        // remove any height set and temp append to the
        // DOM to measure end height
        else {
            // Remove the style
            elem.style.height = '';
            // Dummy DOM node
            var d = document.createElement('div');
            d.position = 'absolute';
            d.style.top = '-9999999999px';
            d.style.left = '-9999999999px';
            // Remove from parent node, append to dummy node
            var par = elem.parentNode;
            var ch = par.removeChild(elem);
            d.appendChild(ch);
            document.body.appendChild(d);
            // This is how high it will be
            e = ch.offsetHeight;
            // Remove from dummy node, set height to zero,
            // and put it back where it was
            elem = d.removeChild(ch);
            var x = document.body.removeChild(d);
            elem.style.height = '0px';
            par.appendChild(elem);
        }
        s = 0;
      }
      else {
        s = elem.offsetHeight;
        e = 0;
      }
      o.props = { height: [s, e] };
    }
    for (var p in opts) {
      o[p] = opts[p];
    }
    o.trans = 'lightEaseIn';
    return new fleegix.fx.Effecter(elem, o);
  }
  function doFade(elem, opts, dir) {
    var s = dir == 'in' ? 0 : 100;
    var e = dir == 'in' ? 100 : 0;
    var o = {
      props: { opacity: [s, e] },
      trans: 'lightEaseIn' };
    for (var p in opts) {
      o[p] = opts[p];
    }
    return new fleegix.fx.Effecter(elem, o);
  }
  // Public (interface) methods
  this.fadeOut = function (elem, opts) {
    return doFade(elem, opts, 'out');
    elem.style.visibility = 'hidden';
    var sync = this.setCssProp(elem, 'opacity', 100);
  };
  this.fadeIn = function (elem, opts) {
    var sync = this.setCssProp(elem, 'opacity', 0);
    elem.style.visibility = 'visible';
    return doFade(elem, opts, 'in');
  };
  this.blindUp = function (elem, opts) {
    var o = opts || {};
    o.blindType = o.blindType || 'height';
    return doBlind(elem, o, 'up');
  };
  this.blindDown = function (elem, opts) {
    var o = opts || {};
    o.blindType = o.blindType || 'height';
    return doBlind(elem, o, 'down');
  };
  this.setCSSProp = function (elem, p, v) {
    if (p == 'opacity') {
      // IE uses a whole number as a percent
      if (document.all) {
        elem.style.filter = 'alpha(opacity=' + v + ')';
      }
      // Moz/compat uses a decimal value
      else {
        var d = v / 100;
        elem.style.opacity = d;
      }
    }
    else if (p == 'clip' || p.toLowerCase().indexOf('color') > -1) {
      elem.style[p] = v;
    }
    else {
      elem.style[p] = document.all ?
        parseInt(v, 10) + 'px' : v + 'px';
    }
    return true;
  };
  this.setCssProp = this.setCSSProp; // Alias, I'm a 'tard and can't remember
  this.hexPat = /^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
  this.hex2rgb = function (str) {
    var rgb = [];
    var h = str.match(this.hexPat);
    if (h) {
      for (var i = 1; i < h.length; i++) {
        var s = h[i];
        s = s.length == 1 ? s + s : s;
        rgb.push(parseInt(s, 16));
      }
      return rgb;
    }
    else {
      throw('"' + str + '" not a valid hex value.');
    }
  };
};

fleegix.fx.Effecter = function (elem, opts) {
  var _this = this;
  this.props = opts.props;
  this.trans = opts.trans || 'lightEaseIn';
  this.duration = opts.duration || 500;
  this.fps = 30;
  this.startTime = new Date().getTime();
  this.timeSpent = 0;
  this.doBeforeStart = opts.doBeforeStart || null;
  this.doAfterFinish = opts.doAfterFinish || null;
  this.autoStart = opts.autoStart === false ? false : true;

  if (typeof this.transitions[this.trans] != 'function') {
    throw('"' + this.trans + '" is not a valid transition.');
  }

  this.start = function () {
    _this.id = setInterval( function () {
      _this.doStep.apply(_this, [elem]); },
      Math.round(1000/_this.fps));
    // Run the pre-execution func if any
    if (typeof opts.doBeforeStart == 'function') {
      _this.doBeforeStart();
    }
  };
  // Fire it up unless auto-start turned off
  if (this.autoStart) {
    this.start();
  }
  return this;
};

fleegix.fx.Effecter.prototype.doStep = function (elem) {
  var t = new Date().getTime();
  var p = this.props;
  // Still going ...
  if (t < (this.startTime + this.duration)) {
    this.timeSpent = t - this.startTime;
    for (var i in p) {
      fleegix.fx.setCSSProp(elem, i, this.calcCurrVal(i));
    }
  }
  // All done, ya-hoo
  else {
    // Make sure to end up on the final values
    for (var i in p) {
      if (i == 'clip') {
        fleegix.fx.setCSSProp(elem, i, 'rect(' + p[i][1].join('px,') + 'px)');
      }
      else {
        fleegix.fx.setCSSProp(elem, i, p[i][1]);
      }
    }
    clearInterval(this.id);
    // Run the post-execution func if any
    if (typeof this.doAfterFinish == 'function') {
      this.doAfterFinish();
    }
  }
};

fleegix.fx.Effecter.prototype.calcCurrVal = function (key) {
  var startVal = this.props[key][0];
  var endVal = this.props[key][1];
  var trans = this.transitions[this.trans];
  var arrStart;
  var arrEnd;
  var arrCurr;
  var s; var e;
  if (key.toLowerCase().indexOf('color') > -1) {
    arrStart = fleegix.fx.hex2rgb(startVal);
    arrEnd = fleegix.fx.hex2rgb(endVal);
    arrCurr = [];
    for (var i = 0; i < arrStart.length; i++) {
      s = arrStart[i];
      e = arrEnd[i];
      arrCurr.push(parseInt(trans(this.timeSpent, s, (e - s),
        this.duration), 10));
    }
    return 'rgb(' + arrCurr.join() + ')';
  }
  else if (key == 'clip') {
    arrStart = startVal;
    arrEnd = endVal;
    arrCurr = [];
    for (var i = 0; i < arrStart.length; i++) {
      s = arrStart[i];
      e = arrEnd[i];
      arrCurr.push(parseInt(trans(this.timeSpent, s, (e - s), this.duration), 10));
    }
    return 'rect(' + arrCurr.join('px,') + 'px)';
  }
  else {
    return trans(this.timeSpent, startVal, (endVal - startVal),
      this.duration);
  }
};

// Credits: Easing Equations, (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), Open Source BSD License.
fleegix.fx.Effecter.prototype.transitions = {
  // For all, t: current time, b: beginning value, c: change in value, d: duration
  // Simple linear, no easing
  linear: function (t, b, c, d) {
    return c*(t/d)+b;
  },
  // 'Light' is quadratic
  lightEaseIn: function (t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  lightEaseOut: function (t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  lightEaseInOut: function (t, b, c, d) {
    if ((t/=d/2) < 1) { return c/2*t*t + b; }
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  // 'Heavy' is cubic
  heavyEaseIn: function (t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  heavyEaseOut: function (t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  heavyEaseInOut: function (t, b, c, d) {
    if ((t/=d/2) < 1) { return c/2*t*t*t + b; }
    return c/2*((t-=2)*t*t + 2) + b;
  }
};


fleegix.dom = new function() {
  var getViewportMeasure = function (s) {
    // IE
    if (document.all) {
      if (document.documentElement &&
        document.documentElement['client' + s]) {
        return document.documentElement['client' + s];
      }
      else {
        return document.body['client' + s];
      }
    }
    // Moz/compat
    else {
      return window['inner' + s];
    }
  };
  this.getViewportWidth = function () {
    return getViewportMeasure('Width');
  };
  this.getViewportHeight = function () {
    return getViewportMeasure('Height');
  };
  this.center = function (node) {
    var nW = node.offsetWidth;
    var nH = node.offsetHeight;
    var vW = fleegix.dom.getViewportWidth();
    var vH = fleegix.dom.getViewportHeight();
    var calcLeft = parseInt((vW/2)-(nW/2), 10);
    var calcTop = parseInt((vH/2)-(nH/2), 10);
    calcTop += document.documentElement.scrollTop;
    node.style.left = calcLeft + 'px';
    node.style.top = calcTop + 'px';
    return true;
  };
  /* Get absolute XY pos of a DOM node */
  this.getOffset = function(node){
    var _getCoords = function (obj) {
      var curleft = 0;
      var curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      return { left: curleft, top: curtop };
    };
    var nodeCoords = null;
    //in IE and Mozilla we can use the
    // getBoundingClientRect()
    if (fleegix.isIE || fleegix.isMoz) {
      nodeCoords = node.getBoundingClientRect();
    }
    else {
      nodeCoords = _getCoords(node);
    }
    return nodeCoords;
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


fleegix.css = new function() {
    this.addClass = function (elem, s) {
      fleegix.css.removeClass(elem, s); // Don't add twice
      var c = elem.className;
      c += ' ' + s;
      c = fleegix.string.trim(c);
      elem.className = c;
    };
    this.removeClass = function (elem, s) {
      var c = elem.className;
      // Esc backslashes in regex pattern
      var pat = '\\b' + s + '\\b';
      // Do global search -- shouldn't be multiple
      // instances of the selector, but who knows
      pat = new RegExp(pat, 'g');
      c = c.replace(pat, '');
      c = c.replace('  ', ' ');
      c = fleegix.string.trim(c);
      elem.className = c;
    };
    this.replaceClass = function (elem, oldClass, newClass) {
      this.removeClass(elem, oldClass);
      this.addClass(elem, newClass);
    };
};


fleegix.event = new function () {
  // List of handlers for event listeners
  var listenerCache = [];
  // List of channels being published to
  var channels = {};

  // If set to true the listener registry is set on
  // the obj itself instead of being hidden on the
  // handler function. This makes it visible/ennumerable
  // but other toolkits' event systems will be less likely
  // to break stuff if it's turned on
  this.compatibilityMode = false;

  this.listen = function () {
    var obj = arguments[0]; // Target object for the new listener
    var meth = arguments[1]; // Method to listen for
    var compatMode = this.compatibilityMode;

    // Simple function
    var r = {}; // package of info about what to execute
    var o = {}; // options -- stopPropagation or preventDefault
    if (typeof arguments[2] == 'function') {
      r.method = arguments[2];
      o = arguments[3] || {};
    }
    // Object and method
    else {
      r.context = arguments[2];
      r.method = arguments[3];
      o = arguments[4] || {};
    }

    if (!obj) { 
      throw new Error('fleegix.listen called on an object (' +
        obj + ') that does not exist.'); }

    // Add dummy onmousewheel that allows us to fake
    // old-school event registration with Firefox's
    // XUL mousewheel event
    if (meth == 'onmousewheel') {
      if (window.addEventListener &&
        typeof obj.onmousewheel == 'undefined') {
        obj.onmousewheel = null;
      }
    }

    // Look to see if there's already a handler and
    // registry of listeners
    var listenReg;
    if (this.compatibilityMode) {
      if (obj[meth] && obj._fleegixEventListenReg) {
        listenReg = obj._fleegixEventListenReg[meth];
      }
      else {
        listenReg = null;
      }
    }
    else {
      listenReg = obj[meth] ? obj[meth].listenReg : null;
    }
    // Create the registry of handlers if it does not exist
    // It will contain all the info needed to run all the attached
    // handlers -- hanging this property on the actual handler
    // (e.g. onclick, onmousedown, onload) to avoid adding visible
    // properties on the object.
    // -----------------
    if (!listenReg) {
      listenReg = {};
      // The original obj and method name
      listenReg.orig = {};
      listenReg.orig.obj = obj;
      listenReg.orig.methName = meth;
      // Preserve any existing listener
      if (obj[meth]) {
        listenReg.orig.methCode = obj[meth];
      }
      // Array of handlers to execute if the method fires
      listenReg.after = [];
      // Replace the original method with the executor proxy
      obj[meth] = function () {
        var reg = compatMode ? obj._fleegixEventListenReg[meth] : obj[meth].listenReg;
        if (!reg) {
          if (obj['_' + meth + '_suppressErrors']) {
            return false;
          }
          else {
            throw new Error('Cannot execute handlers for ' + obj + '  "' +
              meth + '". Something' +
              ' (likely another JavaScript library) has' +
              ' removed the fleegix.event.listen handler registry.');
          }
        }
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        // Try to be a good citizen -- preserve existing listeners
        // Execute with arguments passed, in the right execution context
        if (reg.orig.methCode) {
          reg.orig.methCode.apply(reg.orig.obj, args);
        }
        // DOM events
        // Normalize the different event models
        var ev = null;
        if (obj.attachEvent || obj.nodeType ||
          obj.addEventListener) {
          // Try to find an event if we're not handed one
          if (!args.length) {
            try {
              switch (true) {
                case !!obj.ownerDocument:
                  ev = obj.ownerDocument.parentWindow.event;
                  break;
                case !!obj.documentElement:
                  ev = obj.documentElement.ownerDocument.parentWindow.event;
                  break;
                case !!obj.event:
                  ev = obj.event;
                  break;
                default:
                  ev = window.event;
                  break;
              }
            }
            catch(e) {
              ev = window.event;
            }
          }
          else {
            ev = args[0];
          }
          if (ev) {
            // Set both target and srcElement
            if (typeof ev.target == 'undefined') {
              ev.target = ev.srcElement;
            }
            if (typeof ev.srcElement == 'undefined') {
              ev.srcElement = ev.target;
            }
            // Handle delta differences for mousewheel
            if (ev.type == 'DOMMouseScroll' || ev.type == 'mousewheel') {
              if (ev.wheelDelta) {
                ev.delta = ev.wheelDelta / 120;
              }
              else if (ev.detail) {
                ev.delta = -ev.detail / 3;
              }
            }
            args[0] = ev;
          }
        }
        // Execute all the handler functions registered
        for (var i = 0; i < reg.after.length; i++) {
          var ex = reg.after[i];
          var f = null; // Func to execute
          var c = null; // Execution context
          // Single functions
          if (!ex.context) {
            f = ex.method;
            c = window;
          }
          // Methods of objects
          else {
            f = ex.context[ex.method];
            c = ex.context;
          }
          // Make sure there's something to execute
          if (typeof f != 'function') {
            throw(f + ' is not an executable function.');
          }
          // Pass args and exec in correct scope
          else {
            f.apply(c, args);
          }
          ev = args[0];
          // Stop propagation if needed
          if (ex.stopPropagation) {
            this.stopPropagation(ev);
          }
          // Prevent the default action if needed
          if (ex.preventDefault) {
            this.preventDefault(ev);
          }
        }

      };
      if (this.compatibilityMode) {
        if (!obj._fleegixEventListenReg) { obj._fleegixEventListenReg = {}; }
        obj._fleegixEventListenReg[meth] = listenReg;
      }
      else {
        obj[meth].listenReg = listenReg;
      }
      // Add to global cache -- so we can remove listeners on unload
      listenerCache.push(listenReg);
      // Add XUL event for Firefox mousewheel
      if (meth == 'onmousewheel') {
        if (window.addEventListener) {
          obj.addEventListener('DOMMouseScroll', obj.onmousewheel, false);
        }
      }
    }
    
    // Add the new handler to the listener registry
    listenReg.after.push(r);
    if (this.compatibilityMode) {
      if (!obj._fleegixEventListenReg) { obj._fleegixEventListenReg = {}; }
      obj._fleegixEventListenReg[meth] = listenReg;
    }
    else {
      obj[meth].listenReg = listenReg;
    }
  };
  this.unlisten = function () {
    var obj = arguments[0]; // Obj from which to remove
    var meth = arguments[1]; // Trigger method
    var listenReg;
    if (this.compatibilityMode) {
      if (obj[meth] && obj._fleegixEventListenReg) {
        listenReg = obj._fleegixEventListenReg[meth];
      }
      else {
        listenReg = null;
      }
    }
    else {
      listenReg = obj[meth] ? obj[meth].listenReg : null;
    }
    var remove = null;

    // Bail out if no handlers set
    if (!listenReg) {
      return false;
    }
    // Remove the handler if it's in the list
    for (var i = 0; i < listenReg.after.length; i++) {
      var r = listenReg.after[i];
      // Simple function
      if (typeof arguments[2] == 'function') {
        if (r.method == arguments[2]) {
          listenReg.after.splice(i, 1);
          break; // Only remove one instance per unlisten call
        }
      }
      // Object and method
      else {
        if (r.context == arguments[2] && r.method ==
          arguments[3]) {
          listenReg.after.splice(i, 1);
          break; // Only remove one instance per unlisten call
        }
      }
    }
    if (this.compatibilityMode) {
      obj._fleegixEventListenReg[meth] = listenReg;
    }
    else {
      obj[meth].listenReg = listenReg;
    }
  };
  this.flush = function () {
    // Remove all the registered listeners
    for (var i = 0; i < listenerCache.length; i++) {
      var reg = listenerCache[i];
      removeObj = reg.orig.obj;
      removeMethod = reg.orig.methName;
      removeObj[removeMethod] = null;
    }
  };
  this.subscribe = function(subscr, obj, method) {
    // Make sure there's an obj param
    if (!obj) { return; }
    // Create the channel if it doesn't exist
    if (!channels[subscr]) {
      channels[subscr] = {};
      channels[subscr].audience = [];
    }
    else {
      // Remove any previous listener method for the obj
      this.unsubscribe(subscr, obj);
    }
    // Add the object and its handler to the array
    // for the channel
    channels[subscr].audience.push([obj, method]);
  };
  this.unsubscribe = function(unsubscr, obj) {
    // If not listener obj specified, kill the
    // entire channel
    if (!obj) {
      channels[unsubscr] = null;
    }
    // Otherwise remove the object and its handler
    // from the array for the channel
    else {
      if (channels[unsubscr]) {
        var aud = channels[unsubscr].audience;
        for (var i = 0; i < aud.length; i++) {
          if (aud[i][0] == obj) {
             aud.splice(i, 1);
          }
        }
      }
    }
  };
  this.publish = function(pub, data) {
    // Make sure the channel exists
    if (channels[pub]) {
      var aud = channels[pub].audience;
      // Pass the published data to all the
      // obj/methods listening to the channel
      for (var i = 0; i < aud.length; i++) {
        var listenerObject = aud[i][0];
        var handlerMethod = aud[i][1];
        listenerObject[handlerMethod](data);
      }
    }
  };
  // Convenience method for getting a the source
  // element of an event or its parent based on
  // a particular property
  this.getSrcElementByAttribute = function(e, prop) {
    var node;
    if (e.srcElement) { node = e.srcElement; }
    else if (e.target) { node = e.target; }
    // Avoid trying to use fake obj from IE on disabled
    // form elements
    if (!node || typeof node[prop] == 'undefined') {
      return null;
    }
    // Look up the id of the elem or its parent
    else {
      // Look for something with an id -- not a text node
      while (!node[prop] || node.nodeType == 3) {
        // Bail if we run out of parents
        if (node.parentNode) {
          node = node.parentNode;
        }
        else {
          return null;
        }
      }
    }
    return node;
  };
  this.getSrcElementId = function (e) {
    var node = this.getSrcElementByAttribute(e, 'id') || null;
    return node.id || null;
  };
  this.annihilate = function (e) {
    this.stopPropagation(e);
    this.preventDefault(e);
  };
  this.stopPropagation = function (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    else {
      e.cancelBubble = true;
    }
    return e;
  };
  this.preventDefault = function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    else {
      e.returnValue = false;
    }
    return e;
  };
  // If there are known problems looking up the listener registry
  // for a particular handler, this will allow the execution to 
  // fail silently instead of throwing errors alerting the user
  // that listening functions are not being triggered correctly.
  // Used in cases where listeners are being addded to windows
  // where document.domain is changed on the fly, which causes
  // lookup of .listenReg to fail
  this.suppressHandlerErrors = function (obj, meth) {
    obj['_' + meth + '_suppressErrors'] = true;
  };
};




fleegix.xhr = new function () {
  // Public vars
  // ================================
  // Maximum number of XHR objects to spawn to handle requests
  // Moz/Safari seem to perform significantly better with XHR
  // re-use, IE -- not so much
  this.maxXhrs = 5;
  // Used to increment request IDs -- these may be used for
  // externally tracking or aborting specific requests
  this.lastReqId = 0;
  // Show exceptions for connection failures
  this.debug = false;
  // Default number of seconds before a request times out
  this.defaultTimeoutSeconds = 300;
  // If set to true, use the default err handler for sync requests
  // If false, failures always hand back the whole request object
  this.useDefaultErrHandlerForSync = true;
  // Possible formats for the XHR response
  this.responseFormats = { TXT: 'text',
   XML: 'xml',
   OBJ: 'object' };

  // Public methods
  // ================================
  this.get = function () {
    var o = {};
    var hand = null;
    var args = Array.prototype.slice.apply(arguments);
    if (typeof args[0] == 'function') {
      o.async = true;
      hand = args.shift();
    }
    else {
      o.async = false;
    }
    var url = args.shift();
    // Passing in keyword/obj after URL
    if (typeof args[0] == 'object') {
      var opts = args.shift();
      for (var p in opts) {
        o[p] = opts[p];
      }
    }
    // Normal order-based params of URL, [responseFormat]
    else {
      o.responseFormat = args.shift() || 'text';
    }
    o.handleSuccess = hand;
    o.url = url;
    return this.doReq(o);
  };
  this.doGet = function () {
    return this.get.apply(this, arguments);
  }
  this.post = function () {
    var o = {};
    var hand = null;
    var args = Array.prototype.slice.apply(arguments);
    if (typeof args[0] == 'function') {
      o.async = true;
      hand = args.shift();
    }
    else {
      o.async = false;
    }
    var url = args.shift();
    var data = args.shift();
    // Passing in keyword/obj after URL
    if (typeof args[0] == 'object') {
      var opts = args.shift();
      for (var p in opts) {
        o[p] = opts[p];
      }
    }
    // Normal order-based params of URL, [responseFormat]
    else {
      o.responseFormat = args.shift() || 'text';
    }
    o.handleSuccess = hand;
    o.url = url;
    o.data = data;
    o.method = 'POST';
    return this.doReq(o);
  };
  this.doPost = function () {
    return this.post.apply(this, arguments);
  }
  this.doReq = function (opts) {
    return this.send(opts);
  }
  this.send = function (o) {
    var opts = o || {};
    var req = new fleegix.xhr.Request();
    var xhrId = null;

    // Override default request opts with any specified
    for (var p in opts) {
      if (opts.hasOwnProperty(p)) {
        req[p] = opts[p];
      }
    }
    // HTTP req method all-caps
    req.method = req.method.toUpperCase();

    req.id = this.lastReqId;
    this.lastReqId++; // Increment req ID

    // Return request ID or response
    // Async -- handle request or queue it up
    // -------
    if (req.async) {
      // If we have an instantiated XHR we can use, let him handle it
      if (_idleXhrs.length) {
        xhrId = _idleXhrs.shift();
      }
      // No available XHRs -- spawn a new one if we're still
      // below the limit
      else if (_xhrs.length < this.maxXhrs) {
        xhrId = _spawnXhr();
      }

      // If we have an XHR xhr to handle the request, do it
      // xhrId should be a number (index of XHR obj in _xhrs)
      if (xhrId !== null) {
        _processReq(req, xhrId);
      }
      // No xhr available to handle the request -- queue it up
      else {
        // Uber-requests step to the front of the line, please
        if (req.uber) {
          _requestQueue.unshift(req);
        }
        // Normal queued requests are FIFO
        else {
          _requestQueue.push(req);
        }
      }
      // Return request ID -- may be used for aborting,
      // external tracking, etc.
      return req.id;
    }
    // Sync -- do request inlne and return actual result
    // -------
    else {
        return _processReq(req);
    }
  };
  this.abort = function (reqId) {
    var r = _processingMap[reqId];
    var t = _xhrs[r.xhrId];
    // Abort the req if it's still processing
    if (t) {
      // onreadystatechange can still fire as abort is executed
      t.onreadystatechange = function () { };
      t.abort();
      r.aborted = true;
      _cleanup(r);
      return true;
    }
    else {
      return false;
    }
  };
  // All the goofy normalization and logic to determine
  // what constitutes 'success'
  this.isReqSuccessful = function (obj) {
    var stat = obj.status;
    if (!stat) { return false; }
    // Handle stupid bogus URLMon "Operation Aborted"
    // code in IE for 204 no-content
    if (document.all && stat == 1223) {
      stat = 204;
    }
    if ((stat > 199 && stat < 300) || stat == 304) {
      return true;
    }
    else {
      return false;
    }
  };

  // Private vars
  // ================================
  var _this = this;
  // Prog ID for specific versions of MSXML -- caches after
  // initial req
  var _msProgId = null;
  // Used in response status test
  var _UNDEFINED_VALUE;
  // Array of XHR obj xhrs, spawned as needed up to
  // maxXhrs ceiling
  var _xhrs = [];
  // Queued-up requests -- appended to when all XHR xhrs
  // are in use -- FIFO list, XHR objs respond to waiting
  // requests immediately as then finish processing the current one
  var _requestQueue = [];
  // List of free XHR objs -- xhrs sit here when not
  // processing requests. If this is empty when a new request comes
  // in, we try to spawn a request -- if we're already at max
  // xhr number, we queue the request
  var _idleXhrs = [];
  // Hash of currently in-flight requests -- each string key is
  // the request id of the request
  // Used to abort processing requests
  var _processingMap = {};
  // Array of in-flight request for the watcher to iterate over
  var _processingArray = [];
  // The single XHR obj used for synchronous requests -- sync
  // requests do not participate in the request pooling
  var _syncXhr = null;
  // The single request obj used for sync requests, same
  // as above
  var _syncRequest = null;
  // The id for the setTimeout used in the the
  // request timeout watcher
  var _processingWatcherId = null;

  // Private methods
  // ================================
  // The XHR object factory
  var _spawnXhr = function (isSync) {
    var i = 0;
    var t = [
      'Msxml2.XMLHTTP.6.0',
      'MSXML2.XMLHTTP.3.0',
      'Microsoft.XMLHTTP'
    ];
    var xhrObj = null;
    if (window.XMLHttpRequest) {
      xhrObj = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      if (_msProgId) {
        xhrObj = new ActiveXObject(_msProgId);
      }
      else {
        for (var i = 0; i < t.length; i++) {
          try {
            xhrObj = new ActiveXObject(t[i]);
            // Cache the prog ID, break the loop
            _msProgId = t[i]; break;
          }
          catch(e) {}
        }
      }
    }
    // Instantiate XHR obj
    if (xhrObj) {
      if (isSync) { return xhrObj; }
      else {
        _xhrs.push(xhrObj);
        var xhrId = _xhrs.length - 1;
        return xhrId;
      }
    }
    else {
      throw new Error('Could not create XMLHttpRequest object.');
    }
  };
  // This is the workhorse function that actually
  // sets up and makes the XHR request
  var _processReq = function (req, t) {
    var xhrId = null;
    var xhrObj = null;
    var url = '';
    var resp = null;

    // Async mode -- grab an XHR obj from the pool
    if (req.async) {
      xhrId = t;
      xhrObj = _xhrs[xhrId];
      _processingMap[req.id] = req;
      _processingArray.unshift(req);
      req.xhrId = xhrId;
    }
    // Sync mode -- use single sync XHR
    else {
      if (!_syncXhr) { _syncXhr = _spawnXhr(true); }
      xhrObj = _syncXhr;
      _syncRequest = req;
    }

    // Defeat the evil power of the IE caching mechanism
    if (req.preventCache) {
      var dt = new Date().getTime();
      url = req.url.indexOf('?') > -1 ? req.url + '&preventCache=' + dt :
        req.url + '?preventCache=' + dt;
    }
    else {
      url = req.url;
    }

    // Call 'abort' method in IE to allow reuse of the obj
    if (document.all) {
      xhrObj.abort();
    }

    // Set up the request
    // ==========================
    if (req.username && req.password) {
      xhrObj.open(req.method, url, req.async, req.username, req.password);
    }
    else {
      xhrObj.open(req.method, url, req.async);
    }
    // Override MIME type if necessary for Mozilla/Firefox & Safari
    if (req.mimeType && navigator.userAgent.indexOf('MSIE') == -1) {
      xhrObj.overrideMimeType(req.mimeType);
    }

    // Add any custom headers that are defined
    var headers = req.headers;
    for (var h in headers) {
      if (headers.hasOwnProperty(h)) {
        xhrObj.setRequestHeader(h, headers[h]);
      }
    }
    // Otherwise set correct content-type for POST
    if (req.method == 'POST' || req.method == 'PUT') {
      // Backward-compatibility
      req.data = req.data || req.dataPayload;
      // Firefox throws out the content-length
      // if data isn't present
      if (!req.data) {
        req.data = '';
      }
      // Set content-length for picky servers, but *only*
      // in nice browsers that allow it
      if (!fleegix.isSafari) {
        var contentLength = typeof req.data == 'string' ?
          req.data.length : 0;
        xhrObj.setRequestHeader('Content-Length', contentLength);
      }
      // Set content-type to urlencoded if nothing
      // else specified
      if (typeof req.headers['Content-Type'] == 'undefined') {
        xhrObj.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded');
      }
    }
    // Send the request, along with any POST/PUT data
    // ==========================
    xhrObj.send(req.data);
    // ==========================
    if (_processingWatcherId === null) {
      _processingWatcherId = setTimeout(_watchProcessing, 10);
    }
    // Sync mode -- return actual result inline back to doReq
    if (!req.async) {
      // Blocks here
      var ret = _handleResponse(xhrObj, req);
      _syncRequest = null;
      // Start the watcher loop back up again if need be
      if (_processingArray.length) {
        _processingWatcherId = setTimeout(_watchProcessing, 10);
      }
      // Otherwise stop watching
      else {
        _processingWatcherId = null;
      }
      return ret;
    }
  };
  // Called in a setTimeout loop as long as requests are
  // in-flight, and invokes the handler for each request
  // as it returns
  var _watchProcessing = function () {
    var proc = _processingArray;
    var d = new Date().getTime();

    // Stop looping while processing sync requests
    // after req returns, it will start the loop back up
    if (_syncRequest !== null) {
      return;
    }
    else {
      for (var i = 0; i < proc.length; i++) {
        var req = proc[i];
        var xhrObj = _xhrs[req.xhrId];
        var isTimedOut = ((d - req.startTime) > (req.timeoutSeconds*1000));
        switch (true) {
          // Aborted requests
          case (req.aborted || !xhrObj.readyState):
            _processingArray.splice(i, 1);
            break;
          // Timeouts
          case isTimedOut:
            _processingArray.splice(i, 1);
            _timeout(req);
            break;
          // Actual responses
          case (xhrObj.readyState == 4):
            _processingArray.splice(i, 1);
            _handleResponse.call(_this, xhrObj, req);
            break;
        }
      }
    }
    clearTimeout(_processingWatcherId);
    if (_processingArray.length) {
      _processingWatcherId = setTimeout(_watchProcessing, 10);
    }
    else {
      _processingWatcherId = null;
    }
  };
  var _handleResponse = function (xhrObj, req) {
    // Grab the desired response type
    var resp;
    switch(req.responseFormat) {
      // XML
      case 'xml':
        if (req.xmlDocFromResponseText && typeof fleegix.xml != 'undefined') {
          resp = fleegix.xml.createDoc(xhrObj.responseText);
        }
        else {
          resp = xhrObj.responseXML;
        }
        break;
      // The object itself
      case 'object':
        resp = xhrObj;
        break;
      // Text
      case 'text':
      default:
        resp = xhrObj.responseText;
        break;
    }
    // If we have a One True Event Handler, use that
    // Best for odd cases such as Safari's 'undefined' status
    // or 0 (zero) status from trying to load local files or chrome
    if (req.handleAll) {
      req.handleAll(resp, req.id);
    }
    // Otherwise hand to either success/failure
    else {
      try {
        switch (true) {
          // Request was successful -- execute response handler
          case _this.isReqSuccessful(xhrObj):
            if (req.async) {
              // Make sure handler is defined
              if (!req.handleSuccess) {
                throw new Error('No response handler defined ' +
                  'for this request');
              }
              else {
                req.handleSuccess(resp, req.id);
              }
            }
            // Blocking requests return the result inline on success
            else {
              return resp;
            }
            break;
          // Status of 0 -- in FF, user may have hit ESC while processing
          case (xhrObj.status == 0):
            if (_this.debug) {
              throw new Error('XMLHttpRequest HTTP status is zero.');
            }
            break;
          // Status of null or undefined -- yes, null == undefined
          case (xhrObj.status == _UNDEFINED_VALUE):
            // Squelch -- if you want to get local files or
            // chrome, use 'handleAll' above
            if (_this.debug) {
              throw new Error('XMLHttpRequest HTTP status not set.');
            }
            break;
          // Request failed -- execute error handler or hand back
          // raw request obj
          default:
            // Blocking requests that want the raw object returned
            // on error, instead of letting the built-in handle it
            if (!req.async && !_this.useDefaultErrHandlerForSync) {
              return  resp;
            }
            else {
              if (req.handleErr) {
                req.handleErr(resp, req.id);
              }
              else {
                _handleErrDefault(xhrObj);
              }
            }
            break;
        }
      }
      // FIXME: Might be nice to try to catch NS_ERROR_NOT_AVAILABLE
      // err in Firefox for broken connections
      catch (e) {
        throw e;
      }
    }
    // Clean up, move immediately to respond to any
    // queued up requests
    if (req.async) {
      _cleanup(req);
    }
    return true;
  };
  var _timeout = function (req) {
    if (_this.abort.apply(_this, [req.id])) {
      if (typeof req.handleTimeout == 'function') {
        req.handleTimeout();
      }
      else {
        alert('XMLHttpRequest to ' + req.url + ' timed out.');
      }
    }
  };
  var _cleanup = function (req) {
    // Remove from list of xhrs currently in use
    // this XHR can't be aborted until it's processing again
    delete _processingMap[req.id];

    // Requests queued up, grab one to respond to
    if (_requestQueue.length) {
      var nextReq = _requestQueue.shift();
      // Reset the start time for the request for timeout purposes
      nextReq.startTime = new Date().getTime();
      _processReq(nextReq, req.xhrId);
    }
    // Otherwise this xhr is idle, waiting to respond
    else {
      _idleXhrs.push(req.xhrId);
    }
  };
  var _handleErrDefault = function (r) {
    var errorWin;
    // Create new window and display error
    try {
      errorWin = window.open('', 'errorWin');
      errorWin.document.body.innerHTML = r.responseText;
    }
    // If pop-up gets blocked, inform user
    catch(e) {
      alert('An error occurred, but the error message cannot be' +
      ' displayed because of your browser\'s pop-up blocker.\n' +
      'Please allow pop-ups from this Web site.');
    }
  };
};

fleegix.xhr.Request = function () {
  this.id = 0;
  this.xhrId = null;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.data = null;
  this.readyState = null;
  this.responseText = null;
  this.responseXML = null;
  this.handleSuccess = null;
  this.handleErr = null;
  this.handleAll = null;
  this.handleTimeout = null;
  this.responseFormat = fleegix.xhr.responseFormats.TXT; // TXT, XML, OBJ
  this.xmlDocFromResponseText = false;
  this.mimeType = null;
  this.username = '';
  this.password = '';
  this.headers = [];
  this.preventCache = false;
  this.startTime = new Date().getTime();
  this.timeoutSeconds = fleegix.xhr.defaultTimeoutSeconds; // Default to 30-sec timeout
  this.uber = false;
  this.aborted = false;
};
fleegix.xhr.Request.prototype.setRequestHeader = function (headerName, headerValue) {
  this.headers.push(headerName + ': ' + headerValue);
};


fleegix.json = new function() {
  var _cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
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
        str += '"' + obj.replace(/(["\\])/g, '\\$1').replace(
          /\r/g, '').replace(/\n/g, '\\n') + '"';
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
  var _buildEscapeTest = function () {
    return function (s) {
      var pat = '';
      for (var p in _CHARS) {
        pat += p + '|';
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
  this.needsEscape = _buildEscapeTest();
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

if (typeof fleegix.date == 'undefined') { fleegix.date = {}; }
fleegix.date.util = {};

fleegix.date.util.weekdayLong = ['Sunday', 'Monday', 'Tuesday',
  'Wednesday', 'Thursday', 'Friday', 'Saturday'];
fleegix.date.util.weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed',
  'Thu', 'Fri', 'Sat'];
fleegix.date.util.monthLong = ['January', 'February', 'March',
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'];
fleegix.date.util.monthShort = ['Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
fleegix.date.util.meridian = {
  'AM': 'AM',
  'PM': 'PM'
}

fleegix.date.util.supportedFormats = {
  // abbreviated weekday name according to the current locale
  'a': function (dt) { return fleegix.date.util.weekdayShort[dt.getDay()]; },
  // full weekday name according to the current locale
  'A': function (dt) { return fleegix.date.util.weekdayLong[dt.getDay()]; },
  // abbreviated month name according to the current locale
  'b': function (dt) { return fleegix.date.util.monthShort[dt.getMonth()]; },
  'h': function (dt) { return fleegix.date.util.strftime(dt, '%b'); },
  // full month name according to the current locale
  'B': function (dt) { return fleegix.date.util.monthLong[dt.getMonth()]; },
  // preferred date and time representation for the current locale
  'c': function (dt) { return fleegix.date.util.strftime(dt, '%a %b %d %T %Y'); },
  // century number (the year divided by 100 and truncated
  // to an integer, range 00 to 99)
  'C': function (dt) { return fleegix.date.util.calcCentury(dt.getFullYear());; },
  // day of the month as a decimal number (range 01 to 31)
  'd': function (dt) { return fleegix.date.util.leftPad(dt.getDate(), 2, '0'); },
  // same as %m/%d/%y
  'D': function (dt) { return fleegix.date.util.strftime(dt, '%m/%d/%y') },
  // day of the month as a decimal number, a single digit is
  // preceded by a space (range ' 1' to '31')
  'e': function (dt) { return fleegix.date.util.leftPad(dt.getDate(), 2, ' '); },
  // month as a decimal number, a single digit is
  // preceded by a space (range ' 1' to '12')
  'f': function () { return fleegix.date.util.strftimeNotImplemented('f'); },
  // same as %Y-%m-%d
  'F': function (dt) { return fleegix.date.util.strftime(dt, '%Y-%m-%d');  },
  // like %G, but without the century.
  'g': function () { return fleegix.date.util.strftimeNotImplemented('g'); },
  // The 4-digit year corresponding to the ISO week number
  // (see %V).  This has the same format and value as %Y,
  // except that if the ISO week number belongs to the
  // previous or next year, that year is used instead.
  'G': function () { return fleegix.date.util.strftimeNotImplemented('G'); },
  // hour as a decimal number using a 24-hour clock (range
  // 00 to 23)
  'H': function (dt) { return fleegix.date.util.leftPad(dt.getHours(), 2, '0'); },
  // hour as a decimal number using a 12-hour clock (range
  // 01 to 12)
  'I': function (dt) { return fleegix.date.util.leftPad(
    fleegix.date.util.hrMil2Std(dt.getHours()), 2, '0'); },
  // day of the year as a decimal number (range 001 to 366)
  'j': function (dt) { return fleegix.date.util.leftPad(
    fleegix.date.util.calcDays(dt), 3, '0'); },
  // Hour as a decimal number using a 24-hour clock (range
  // 0 to 23 (space-padded))
  'k': function (dt) { return fleegix.date.util.leftPad(dt.getHours(), 2, ' '); },
  // Hour as a decimal number using a 12-hour clock (range
  // 1 to 12 (space-padded))
  'l': function (dt) { return fleegix.date.util.leftPad(
    fleegix.date.util.hrMil2Std(dt.getHours()), 2, ' '); },
  // month as a decimal number (range 01 to 12)
  'm': function (dt) { return fleegix.date.util.leftPad((dt.getMonth()+1), 2, '0'); },
  // minute as a decimal number
  'M': function (dt) { return fleegix.date.util.leftPad(dt.getMinutes(), 2, '0'); },
  // Linebreak
  'n': function () { return '\n'; },
  // either `am' or `pm' according to the given time value,
  // or the corresponding strings for the current locale
  'p': function (dt) { return fleegix.date.util.getMeridian(dt.getHours()); },
  // time in a.m. and p.m. notation
  'r': function (dt) { return fleegix.date.util.strftime(dt, '%I:%M:%S %p'); },
  // time in 24 hour notation
  'R': function (dt) { return fleegix.date.util.strftime(dt, '%H:%M'); },
  // second as a decimal number
  'S': function (dt) { return fleegix.date.util.leftPad(dt.getSeconds(), 2, '0'); },
  // Tab char
  't': function () { return '\t'; },
  // current time, equal to %H:%M:%S
  'T': function (dt) { return fleegix.date.util.strftime(dt, '%H:%M:%S'); },
  // weekday as a decimal number [1,7], with 1 representing
  // Monday
  'u': function (dt) { return fleegix.date.util.convertOneBase(dt.getDay()); },
  // week number of the current year as a decimal number,
  // starting with the first Sunday as the first day of the
  // first week
  'U': function () { return fleegix.date.util.strftimeNotImplemented('U'); },
  // week number of the year (Monday as the first day of the
  // week) as a decimal number [01,53]. If the week containing
  // 1 January has four or more days in the new year, then it
  // is considered week 1. Otherwise, it is the last week of
  // the previous year, and the next week is week 1.
  'V': function () { return fleegix.date.util.strftimeNotImplemented('V'); },
  // week number of the current year as a decimal number,
  // starting with the first Monday as the first day of the
  // first week
  'W': function () { return fleegix.date.util.strftimeNotImplemented('W'); },
  // day of the week as a decimal, Sunday being 0
  'w': function (dt) { return dt.getDay(); },
  // preferred date representation for the current locale
  // without the time
  'x': function (dt) { return fleegix.date.util.strftime(dt, '%D'); },
  // preferred time representation for the current locale
  // without the date
  'X': function (dt) { return fleegix.date.util.strftime(dt, '%T'); },
  // year as a decimal number without a century (range 00 to
  // 99)
  'y': function (dt) { return fleegix.date.util.getTwoDigitYear(dt.getFullYear()); },
  // year as a decimal number including the century
  'Y': function (dt) { return fleegix.date.util.leftPad(dt.getFullYear(), 4, '0'); },
  // time zone or name or abbreviation
  'z': function () { return fleegix.date.util.strftimeNotImplemented('z'); },
  'Z': function () { return fleegix.date.util.strftimeNotImplemented('Z'); },
  // Literal percent char
  '%': function (dt) { return '%'; }
};

fleegix.date.util.getSupportedFormats = function () {
  var str = '';
  for (var i in fleegix.date.util.supportedFormats) { str += i; }
  return str;
}

fleegix.date.util.supportedFormatsPat = new RegExp('%[' +
  fleegix.date.util.getSupportedFormats() + ']{1}', 'g');

fleegix.date.util.strftime = function (dt, format) {
  var d = null;
  var pats = [];
  var dts = [];
  var str = format;

  // If no dt, use current date
  d = dt ? dt : new Date();
  // Allow either Date obj or UTC stamp
  d = typeof dt == 'number' ? new Date(dt) : dt;

  // Grab all instances of expected formats into array
  while (pats = fleegix.date.util.supportedFormatsPat.exec(format)) {
    dts.push(pats[0]);
  }

  // Process any hits
  for (var i = 0; i < dts.length; i++) {
    key = dts[i].replace(/%/, '');
    str = str.replace('%' + key,
      fleegix.date.util.supportedFormats[key](d));
  }
  return str;

};

fleegix.date.util.strftimeNotImplemented = function (s) {
  throw('fleegix.date.util.strftime format "' + s + '" not implemented.');
};

fleegix.date.util.leftPad = function (instr, len, spacer) {
  var str = instr.toString();
  // spacer char optional, default to space
  var sp = spacer ? spacer : ' ';
  while (str.length < len) {
    str = sp + str;
  }
  return str;
};

/**
 * Calculate the century to which a particular year belongs
 * @param y Integer year number
 * @return Integer century number
 */
fleegix.date.util.calcCentury = function (y) {
  var ret = parseInt(y/100);
  ret = ret.toString();
  return fleegix.date.util.leftPad(ret);
};

/**
 * Calculate the day number in the year a particular date is on
 * @param dt JavaScript date object
 * @return Integer day number in the year for the given date
 */
fleegix.date.util.calcDays = function(dt) {
  var first = new Date(dt.getFullYear(), 0, 1);
  var diff = 0;
  var ret = 0;
  first = first.getTime();
  diff = (dt.getTime() - first);
  ret = parseInt(((((diff/1000)/60)/60)/24))+1;
  return ret;
};

/**
 * Adjust from 0-6 base week to 1-7 base week
 * @param d integer for day of week
 * @return Integer day number for 1-7 base week
 */
fleegix.date.util.convertOneBase = function (d) {
  return d == 0 ? 7 : d;
};

fleegix.date.util.getTwoDigitYear = function (yr) {
  // Add a millenium to take care of years before the year 1000,
  // (e.g, the year 7) since we're only taking the last two digits
  // If we overshoot, it doesn't matter
  var millenYear = yr + 1000;
  var str = millenYear.toString();
  str = str.substr(2); // Get the last two digits
  return str
};

/**
 * Return 'AM' or 'PM' based on hour in 24-hour format
 * @param h Integer for hour in 24-hour format
 * @return String of either 'AM' or 'PM' based on hour number
 */
fleegix.date.util.getMeridian = function (h) {
  return h > 11 ? fleegix.date.util.meridian.PM :
    fleegix.date.util.meridian.AM;
};

/**
 * Convert a 24-hour formatted hour to 12-hour format
 * @param hour Integer hour number
 * @return String for hour in 12-hour format -- may be string length of one
 */
fleegix.date.util.hrMil2Std = function (hour) {
  var h = typeof hour == 'number' ? hour : parseInt(hour);
  var str = h > 12 ? h - 12 : h;
  str = str == 0 ? 12 : str;
  return str;
};

/**
 * Convert a 12-hour formatted hour with meridian flag to 24-hour format
 * @param hour Integer hour number
 * @param pm Boolean flag, if PM hour then set to true
 * @return String for hour in 24-hour format
 */
fleegix.date.util.hrStd2Mil = function  (hour, pm) {
  var h = typeof hour == 'number' ? hour : parseInt(hour);
  var str = '';
  // PM
  if (pm) {
    str = h < 12 ? (h+12) : h;
  }
  // AM
  else {
    str = h == 12 ? 0 : h;
  }
  return str;
};

// Constants for use in fleegix.date.util.add
fleegix.date.util.dateParts = {
  YEAR: 0, MONTH: 1, DAY: 2, HOUR: 3, MINUTE: 4, SECOND: 5,
    MILLISECOND: 6, QUARTER: 7, WEEK: 8, WEEKDAY: 9
};

/**
 * Add to a Date in intervals of different size, from
 * milliseconds to years
 * @param dt -- Date (or timestamp Number), date to increment
 * @param interv -- Number, a constant representing the interval,
 *    e.g. YEAR, MONTH, DAY.  See fleegix.date.util.dateParts
 * @param incr -- Number, how much to add to the date
 * @return Integer day number for 1-7 base week
 */
fleegix.date.util.add = function (dt, interv, incr) {
  if (typeof dt == 'number') { dt = new Date(dt); }
  function fixOvershoot(){
    if (sum.getDate() < dt.getDate()){
      sum.setDate(0);
    }
  }
  var sum = new Date(dt);
  with (fleegix.date.util.dateParts) {
    switch(interv){
      case YEAR:
        sum.setFullYear(dt.getFullYear()+incr);
        // Keep increment/decrement from 2/29 out of March
        fixOvershoot();
        break;
      case QUARTER:
        // Naive quarter is just three months
        incr*=3;
        // fallthrough...
      case MONTH:
        sum.setMonth(dt.getMonth()+incr);
        // Reset to last day of month if you overshoot
        fixOvershoot();
        break;
      case WEEK:
        incr*=7;
        // fallthrough...
      case DAY:
        sum.setDate(dt.getDate() + incr);
        break;
      case WEEKDAY:
        //FIXME: assumes Saturday/Sunday weekend, but even this is not fixed.
        // There are CLDR entries to localize this.
        var dat = dt.getDate();
        var weeks = 0;
        var days = 0;
        var strt = 0;
        var trgt = 0;
        var adj = 0;
        // Divide the increment time span into weekspans plus leftover days
        // e.g., 8 days is one 5-day weekspan / and two leftover days
        // Can't have zero leftover days, so numbers divisible by 5 get
        // a days value of 5, and the remaining days make up the number of weeks
        var mod = incr % 5;
        if (mod == 0) {
          days = (incr > 0) ? 5 : -5;
          weeks = (incr > 0) ? ((incr-5)/5) : ((incr+5)/5);
        }
        else {
          days = mod;
          weeks = parseInt(incr/5);
        }
        // Get weekday value for orig date param
        strt = dt.getDay();
        // Orig date is Sat / positive incrementer
        // Jump over Sun
        if (strt == 6 && incr > 0) {
          adj = 1;
        }
        // Orig date is Sun / negative incrementer
        // Jump back over Sat
        else if (strt == 0 && incr < 0) {
          adj = -1;
        }
        // Get weekday val for the new date
        trgt = strt + days;
        // New date is on Sat or Sun
        if (trgt == 0 || trgt == 6) {
          adj = (incr > 0) ? 2 : -2;
        }
        // Increment by number of weeks plus leftover days plus
        // weekend adjustments
        sum.setDate(dat + (7*weeks) + days + adj);
        break;
      case HOUR:
        sum.setHours(sum.getHours()+incr);
        break;
      case MINUTE:
        sum.setMinutes(sum.getMinutes()+incr);
        break;
      case SECOND:
        sum.setSeconds(sum.getSeconds()+incr);
        break;
      case MILLISECOND:
        sum.setMilliseconds(sum.getMilliseconds()+incr);
        break;
      default:
        // Do nothing
        break;
    }
  }
  return sum; // Date
};

/**
 * Get the difference in a specific unit of time (e.g., number
 * of months, weeks, days, etc.) between two dates.
 * @param date1 -- Date (or timestamp Number)
 * @param date2 -- Date (or timestamp Number)
 * @param interv -- Number, a constant representing the interval,
 *    e.g. YEAR, MONTH, DAY.  See fleegix.date.util.dateParts
 * @return Integer, number of (interv) units apart that
 *    the two dates are
 */
fleegix.date.util.diff = function (date1, date2, interv) {
//  date1
//    Date object or Number equivalent
//
//  date2
//    Date object or Number equivalent
//
//  interval
//    A constant representing the interval, e.g. YEAR, MONTH, DAY.  See fleegix.date.util.dateParts.

  // Accept timestamp input
  if (typeof date1 == 'number') { date1 = new Date(date1); }
  if (typeof date2 == 'number') { date2 = new Date(date2); }
  var yeaDiff = date2.getFullYear() - date1.getFullYear();
  var monDiff = (date2.getMonth() - date1.getMonth()) + (yeaDiff * 12);
  var msDiff = date2.getTime() - date1.getTime(); // Millisecs
  var secDiff = msDiff/1000;
  var minDiff = secDiff/60;
  var houDiff = minDiff/60;
  var dayDiff = houDiff/24;
  var weeDiff = dayDiff/7;
  var delta = 0; // Integer return value

  with (fleegix.date.util.dateParts) {
    switch (interv) {
      case YEAR:
        delta = yeaDiff;
        break;
      case QUARTER:
        var m1 = date1.getMonth();
        var m2 = date2.getMonth();
        // Figure out which quarter the months are in
        var q1 = Math.floor(m1/3) + 1;
        var q2 = Math.floor(m2/3) + 1;
        // Add quarters for any year difference between the dates
        q2 += (yeaDiff * 4);
        delta = q2 - q1;
        break;
      case MONTH:
        delta = monDiff;
        break;
      case WEEK:
        // Truncate instead of rounding
        // Don't use Math.floor -- value may be negative
        delta = parseInt(weeDiff);
        break;
      case DAY:
        delta = dayDiff;
        break;
      case WEEKDAY:
        var days = Math.round(dayDiff);
        var weeks = parseInt(days/7);
        var mod = days % 7;

        // Even number of weeks
        if(mod == 0){
          days = weeks*5;
        }else{
          // Weeks plus spare change (< 7 days)
          var adj = 0;
          var aDay = date1.getDay();
          var bDay = date2.getDay();

          weeks = parseInt(days/7);
          mod = days % 7;
          // Mark the date advanced by the number of
          // round weeks (may be zero)
          var dtMark = new Date(date1);
          dtMark.setDate(dtMark.getDate()+(weeks*7));
          var dayMark = dtMark.getDay();

          // Spare change days -- 6 or less
          if(dayDiff > 0){
            switch(true){
              // Range starts on Sat
              case aDay == 6:
                adj = -1;
                break;
              // Range starts on Sun
              case aDay == 0:
                adj = 0;
                break;
              // Range ends on Sat
              case bDay == 6:
                adj = -1;
                break;
              // Range ends on Sun
              case bDay == 0:
                adj = -2;
                break;
              // Range contains weekend
              case (dayMark + mod) > 5:
                adj = -2;
                break;
              default:
                // Do nothing
                break;
            }
          }else if(dayDiff < 0){
            switch (true) {
              // Range starts on Sat
              case aDay == 6:
                adj = 0;
                break;
              // Range starts on Sun
              case aDay == 0:
                adj = 1;
                break;
              // Range ends on Sat
              case bDay == 6:
                adj = 2;
                break;
              // Range ends on Sun
              case bDay == 0:
                adj = 1;
                break;
              // Range contains weekend
              case (dayMark + mod) < 0:
                adj = 2;
                break;
              default:
                // Do nothing
                break;
            }
          }
          days += adj;
          days -= (weeks*2);
        }
        delta = days;

        break;
      case HOUR:
        delta = houDiff;
        break;
      case MINUTE:
        delta = minDiff;
        break;
      case SECOND:
        delta = secDiff;
        break;
      case MILLISECOND:
        delta = msDiff;
        break;
      default:
        // Do nothing
        break;
    }
  }
  // Round for fractional values and DST leaps
  return Math.round(delta); // Number (integer)
};



if (typeof fleegix.hash == 'undefined') { fleegix.hash = {}; }
fleegix.hash.UNDEFINED_VALUE;
fleegix.hash.Hash = function (d) {
  this.count = 0;
  this.items = {}; // Hash keys and their values
  this.order = []; // Array for sort order
  if (d) { this.defaultValue = d; };
};
fleegix.hash.Hash.prototype = new function () {
  // Private methods
  var getRandomKey = function () {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var len = 16;
    var str = '';
    var mls = new Date().getTime();
    for (var i = 0; i < len; i++) {
      // In Safari 2 Math.random returns the same random
      // sequence after firing up the browser -- return
      // something randomish
      if (navigator.userAgent.indexOf('Safari/41') > -1) {
        rnum = (((mls / (i + 1)) + mls) % chars.length);
      }
      else {
        var rnum = (Math.random() * chars.length);
      }
      rnum = Math.floor(rnum);
      str += chars.substring(rnum, rnum + 1);
    }
    return str;
  };
  // Interface methods
  this.addItem = function (key, val) {
    if (typeof key != 'string') {
      throw('Hash only allows string keys.');
    }
    return this.setByKey(key, val);
  };
  this.addItemCreateKey = function (val) {
    var key = getRandomKey();
    this.setByKey(key, val);
    return key;
  };
  this.getItem = function (p) {
    if (typeof p == 'string') {
      return this.getByKey(p);
    }
    else if (typeof p == 'number') {
      return this.getByIndex(p);
    }
  };
  this.setItem = function (p, val) {
    if (typeof p == 'string') {
      this.setByKey(p, val);
    }
    else if (typeof p == 'number') {
      this.setByIndex(p, val);
    }
  };
  this.removeItem = function (p) {
    if (typeof p == 'string') {
      this.removeByKey(p);
    }
    else if (typeof p == 'number') {
      this.removeByIndex(p);
    }
  };
  this.getByKey = function (key) {
    return this.items[key];
  };
  this.setByKey = function (key, val) {
    var v = null;
    if (typeof val == 'undefined') {
      v = this.defaultValue;
    }
    else { v = val; }
    if (typeof this.items[key] == 'undefined') {
      this.order[this.count] = key;
      this.count++;
    }
    this.items[key] = v;
    return this.items[key];
  };
  this.removeByKey = function (key) {
    if (typeof this.items[key] != 'undefined') {
      var pos = null;
      delete this.items[key]; // Remove the value
      // Find the key in the order list
      for (var i = 0; i < this.order.length; i++) {
        if (this.order[i] == key) {
          pos = i;
        }
      }
      this.order.splice(pos, 1); // Remove the key
      this.count--; // Decrement the length
    }
  };
  this.getByIndex = function (ind) {
    return this.items[this.order[ind]];
  };
  this.setByIndex = function (ind, val) {
    if (ind < 0 || ind >= this.count) {
      throw('Index out of bounds. Hash length is ' + this.count);
    }
    this.items[this.order[ind]] = val;
  };
  this.removeByIndex = function (pos) {
    var ret = this.items[this.order[pos]];
    if (typeof ret != 'undefined') {
      delete this.items[this.order[pos]]
      this.order.splice(pos, 1);
      this.count--;
      return true;
    }
    else {
      return false;
    }
  };
  this.hasKey = function (key) {
    return typeof this.items[key] != 'undefined';
  };
  this.hasValue = function (val) {
    for (var i = 0; i < this.order.length; i++) {
      if (this.items[this.order[i]] == val) {
        return true;
      }
    }
    return false;
  };
  this.allKeys = function (str) {
    return this.order.join(str);
  };
  this.replaceKey = function (oldKey, newKey) {
    // If item for newKey exists, nuke it
    if (this.hasKey(newKey)) {
      this.removeItem(newKey);
    }
    this.items[newKey] = this.items[oldKey];
    delete this.items[oldKey];
    for (var i = 0; i < this.order.length; i++) {
      if (this.order[i] == oldKey) {
        this.order[i] = newKey;
      }
    }
  };
  this.insertAtIndex = function (pos, key, val) {
    this.order.splice(pos, 0, key);
    this.items[key] = val;
    this.count++;
    return true;
  };
  this.insertAfterKey = function (refKey, key, val) {
    var pos = this.getPos(refKey);
    this.insertAtPos(pos, key, val);
  };
  this.getPosition = function (key) {
    var order = this.order;
    if (typeof order.indexOf == 'function') {
      return order.indexOf(key);
    }
    else {
      for (var i = 0; i < order.length; i++) {
        if (order[i] == key) { return i;}
      }
    }
  }
  this.each = function (func, o) {
    var opts = o || {};
    var len = this.order.length;
    var start = opts.start ? opts.start : 0;
    var ceiling = opts.items ? (start + opts.items) : len;
    ceiling = (ceiling > len) ? len : ceiling;
    for (var i = start; i < ceiling; i++) {
      var key = this.order[i];
      var val = this.items[key];
      if (opts.keyOnly) {
        func(key);
      }
      else if (opts.valueOnly) {
        func(val);
      }
      else {
        func(val, key);
      }
    }
    return true;
  };
  this.eachKey = function (func) {
    this.each(func, { keyOnly: true });
  };
  this.eachValue = function (func) {
    this.each(func, { valueOnly: true });
  };
  this.clone = function () {
    var h = new fleegix.hash.Hash();
    for (var i = 0; i < this.order.length; i++) {
      var key = this.order[i];
      var val = this.items[key];
      h.setItem(key, val);
    }
    return h;
  };
  this.concat = function (hNew) {
    for (var i = 0; i < hNew.order.length; i++) {
      var key = hNew.order[i];
      var val = hNew.items[key];
      this.setItem(key, val);
    }
  };
  this.push = function (key, val) {
    this.insertAtIndex(this.count, key, val);
    return this.count;
  };
  this.pop = function () {
    var pos = this.count-1;
    var ret = this.items[this.order[pos]];
    if (typeof ret != 'undefined') {
      this.removeAtPos(pos);
      return ret;
    }
    else {
      return fleegix.hash.UNDEFINED_VALUE;
    }
  };
  this.unshift = function (key, val) {
    this.insertAtIndex(0, key, val);
    return this.count;
  };
  this.shift = function (key, val) {
    var pos = 0;
    var ret = this.items[this.order[pos]];
    if (typeof ret != 'undefined') {
      this.removeAtPos(pos);
      return ret;
    }
    else {
      return fleegix.hash.UNDEFINED_VALUE;
    }
  };
  this.splice = function (index, numToRemove, hash) {
    var _this = this;
    // Removal
    if (numToRemove > 0) {
      // Items
      var limit = index + numToRemove;
      for (var i = index; i < limit; i++) {
        delete this.items[this.order[i]];
      }
      // Order
      this.order.splice(index, numToRemove);
    }
    // Adding 
    if (hash) {
      // Items
      for (var i in hash.items) {
        this.items[i] = hash.items[i];
      }
      // Order
      var args = hash.order;
      args.unshift(0);
      args.unshift(index);
      this.order.splice.apply(this.order, args);
    }
    this.count = this.order.length;
  };
  this.sort = function (s) {
    var c = s || fleegix.hash.sorts.ASCENDING_NOCASE;
    var arr = [];
    if (typeof c != 'function') {
      throw('Hash sort requires a valid comparator function.');
    }
    var comp = function (a, b) {
      return c(a.val, b.val);
    }
    for (var i = 0; i < this.order.length; i++) {
      var key = this.order[i];
      arr[i] = { key: key, val: this.items[key] };
    }
    arr.sort(comp);
    this.order = [];
    for (var i = 0; i < arr.length; i++) {
      this.order.push(arr[i].key);
    }
  };
  this.sortByKey = function (s) {
    var comp = s || fleegix.hash.sorts.ASCENDING_NOCASE;
    if (typeof compar != 'function') {
      throw('Hash sort requires a valid comparator function.');
    }
    this.order.sort(comp);
  };
  this.reverse = function () {
    this.order.reverse();
  };
};

// Stock comparators for sorts
fleegix.hash.sorts = {
  ASCENDING_WITH_CASE: function (a, b) {
    return (a >= b) ?  1 : -1;
  },
  DESCENDING_WITH_CASE: function (a, b) {
    return (a < b) ?  1 : -1;
  },
  ASCENDING_NOCASE: function (a, b) {
    return (a.toLowerCase() >=
      b.toLowerCase()) ? 1 : -1;
  },
  DESCENDING_NOCASE: function (a, b) {
    return (a.toLowerCase() <
      b.toLowerCase()) ? 1 : -1;
  }
};



if (typeof fleegix.ui == 'undefined') { fleegix.ui = {}; }
fleegix.ui.GlyphRegistry = {};
fleegix.ui.defaultUnits = 'px';
fleegix.ui.Glyph = function (domNode, id) {
  this.domNode = domNode || null;
  this.id = id || domNode.id;
  if (!this.id) { throw new Error('Glyph must have an id.'); }
  // Positioning fu
  this.top = 0;
  this.left = 0;
  this.width = 0;
  this.height = 0;
  // Data
  this.data = null;
  // Hierarchicalness
  this.parent = null;
  this.children = [];
  // Flag for init-only code that has to run
  this.hasBeenRendered = false;
  // Visibility flag
  this.visible = true;
  // List of Glyphes
  fleegix.ui.GlyphRegistry[id] = this;
  // Place to keep data
  this.data = null;
};
fleegix.ui.Glyph.prototype = new function () {
  this.cleanup =  function () {
    this.domNode = null;
  };
  this.clearNode =  function (node, useInnerHTML) {
    if (useInnerHTML) {
      node.innerHTML = '';
    }
    else {
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
    }
  };
  this.clearAll =  function () {
    if (this.domNode) {
      this.clearNode(this.domNode);
    }
    var ch = this.children;
    if (ch && ch.length) {
      for (var i = 0; i < ch.length; i++) {
        ch[i].clearAll();
      }
    }
  };
  this.setPosition =  function (left, top) {
    this.setTop(top);
    this.setLeft(left);
  };
  this.setSize =  function (width, height) {
    this.setWidth(width);
    this.setHeight(height);
  };
  this.setTop =  function (top) {
    if (typeof top != 'undefined') {
      this.top = top;
    }
    n = this.top;
    if (fleegix.ui.defaultUnits == 'px') {
      n = parseInt(n, 10);
    }
    this.domNode.style.position = 'absolute';
    this.domNode.style.top = n + fleegix.ui.defaultUnits;
  };
  this.setLeft =  function (left) {
    if (typeof left != 'undefined') {
      this.left = left;
    }
    n = this.left;
    if (fleegix.ui.defaultUnits == 'px') {
      n = parseInt(n, 10);
    }
    this.domNode.style.position = 'absolute';
    this.domNode.style.left = n + fleegix.ui.defaultUnits;
  };
  this.setWidth =  function (width) {
    if (typeof width != 'undefined') {
      this.width = width;
    }
    n = this.width;
    if (typeof n == 'number') {
      if (fleegix.ui.defaultUnits == 'px') {
        n = parseInt(n, 10);
      }
      n = n.toString() + fleegix.ui.defaultUnits
    }
    this.domNode.style.width = n;
  };
  this.setHeight =  function (height) {
    if (typeof height != 'undefined') {
      this.height = height;
    }
    n = this.height;
    if (typeof n == 'number') {
      if (fleegix.ui.defaultUnits == 'px') {
        n = parseInt(n, 10);
      }
      n = n.toString() + fleegix.ui.defaultUnits
    }
    this.domNode.style.height = n;
  };
  this.appendToDomNode = function (node) {
    if (!this.domNode) {
      throw new Error('Glyph "' + this.id + '" has no domNode.');
    }
    else {
      node.appendChild(this.domNode);
    }
  }
  this.hide =  function (visOnly) {
    if (visOnly) {
      this.domNode.style.visibility = 'hidden';
    }
    else {
      this.domNode.style.display = 'none';
    }
    this.visible = false;
  };
  this.show =  function (visOnly) {
    if (visOnly) {
      this.domNode.style.visibility = 'visible';
    }
    else {
      this.domNode.style.display = 'block';
    }
    this.visible = true;
  };
  this.renderSelf =  function () {};
  this.update = function (p) {
    var params = p || {};
    for (var n in params) { this[n] = params[n]; }
  };
  this.render = function () {
    // Run the init function on first render if it's defined
    if (!this.hasBeenRendered && typeof this.init == 'function') {
      this.init();
    }
    if (typeof this.renderSelf == 'function') {
      this.renderSelf();
    };
    var children = this.children;
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      child.render();
    }
    this.hasBeenRendered = true;
  };
  this.addChild = function (c) {
    this.children.push(c);
    c.parent = this;
    this[c.id] = c;
    this.domNode.appendChild(c.domNode);
  };
  this.center = function () {
    if (!fleegix.dom) {
      throw new Error('This method depends on the fleegix.dom module in fleegix.js base.');
    }
    else {
      this.domNode.style.position = 'absolute';
      fleegix.dom.center(this.domNode);
    }
  };
};




fleegix.i18n = new function () {
  var _this = this;
  this.localizedStrings = {};
  this.getText = function () {
    var args = Array.prototype.slice.apply(arguments);
    var key = args.shift();
    var str = _this.localizedStrings[key] || "[[" + key + "]]";
    for (var i = 0; i < args.length; i++){
        str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    }
    return str;
  };
  this.setLocalizedStrings = function (obj) {
    this.localizedStrings = obj || {};
  };
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

if (typeof fleegix.drag == 'undefined') { fleegix.drag = {}; }
fleegix.drag.xPos = null;
fleegix.drag.yPos = null;
// Manager singleton
fleegix.drag.DragManager = new function () {
  var _this = this;
  this.registry = [];
  this.raiseMap = {};
  this.dragMap = {};
  this.currentDraggable = null;
  this.currentZIndex = 99999;
  this.addDragWindow = function (containerNode, handleNode, shadowNode) {
    if (!containerNode.id) {
      throw('Draggable DOM nodes must have an id'); }
    if (!handleNode) { handleNode = containerNode; }
    var setupDrag =
      function (e) { _this.setUpDrag.apply(_this, [e]); };
    fleegix.event.listen(handleNode, 'onmousedown', setupDrag);
    var raiseDraggable =
      function (e) { _this.raiseDraggable.apply(_this, [e]); };
    fleegix.event.listen(containerNode,
      'onmousedown', raiseDraggable);
    var d = new fleegix.drag.DragWindow({
      containerNode: containerNode, shadowNode: shadowNode });
    this.registry.push(d);
    this.raiseMap[containerNode.id] = d;
    this.dragMap[handleNode.id] = d;
    this.raiseDraggable(containerNode.id);
  };
  this.setUpDrag = function (e) {
    var elem = e.target;
    var d = this.dragMap[elem.id];
    // Look up the DOM hierarchy until we find
    //something in the map of raiseable nodes
    while (!d && elem != document.body) {
      if (elem.parentNode) {
        elem = elem.parentNode;
        d = this.dragMap[elem.id];
      }
    }
    if (d) {
      this.currentDraggable = d;
      this.currentDraggable.startDrag();
    }
  };
  this.raiseDraggable = function (p) {
    var key = '';
    if (typeof p == 'string') {
      var d = this.raiseMap[p];
    }
    else {
      var elem = p.target;
      var d = this.raiseMap[elem.id];
      // Look up the DOM hierarchy until we find
      //something in the map of raiseable nodes
      while (!d && elem != document.body) {
        if (elem.parentNode) {
          elem = elem.parentNode;
          d = this.raiseMap[elem.id];
        }
      }
    }
    this.currentZIndex++;
    d.containerNode.style.zIndex = this.currentZIndex;
    if (d.shadowNode) {
      d.shadowNode.style.zIndex = this.currentZIndex - 1; 
    }
  };
  this.mouseMoveHandler = function (e) {
    var d = fleegix.drag;
    d.xPos = e.clientX;
    d.yPos = e.clientY;
    if (_this.currentDraggable) {
      _this.currentDraggable.drag();
    }
  };
  this.mouseUpHandler = function (e) {
    if (_this.currentDraggable) {
      _this.currentDraggable.drop();
      _this.currentDraggable = null;
    }
  };
};
// Draggable DragWindow pseudoclass
fleegix.drag.DragWindow = function (p) {
  var params = p || {};
  this.containerNode = null;
  this.shadowNode = null;
  this.handleNode = null;
  this.clickOffsetX = 0;
  this.clickOffsetY = 0;
  for (var n in params) { this[n] = params[n] }
};
fleegix.drag.DragWindow.prototype.startDrag = function () {
  var d = fleegix.drag;
  this.clickOffsetX = d.xPos -
    parseInt(this.containerNode.style.left);
  this.clickOffsetY = d.yPos -
    parseInt(this.containerNode.style.top);
  // Turn off text selection in IE while dragging
  document.onselectstart = function () { return false; };
};
fleegix.drag.DragWindow.prototype.drag = function () {
  var d = fleegix.drag;
  var x = (d.xPos - this.clickOffsetX) + 'px';
  var y = (d.yPos - this.clickOffsetY) + 'px';
  this.containerNode.style.left = x;
  this.containerNode.style.top = y;
  if (this.shadowNode) {
    this.shadowNode.style.left = x;
    this.shadowNode.style.top = y;
  }
  // Hacky way of preventing text selection in FF
  // for the entire doc -- inserting a CSS rule for
  // -moz-user-select for all elements or something
  // seems like a lot of work
  document.body.focus();
};
fleegix.drag.DragWindow.prototype.drop = function () {
  // Re-enable text selection in IE
  document.onselectstart = null;
};
// Event listeners for dragging, raising DragWindow, dropping
fleegix.event.listen(document, 'onmousemove',
  fleegix.drag.DragManager, 'mouseMoveHandler');
fleegix.event.listen(document, 'onmouseup',
  fleegix.drag.DragManager, 'mouseUpHandler');

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
if (typeof fleegix == 'undefined') { throw('Requires fleegix base namespace.'); }
if (typeof fleegix.xhr == 'undefined') { throw('Requires fleegix.xhr namespace.'); }
if (typeof fleegix.template == 'undefined') { fleegix.template = {}; }
// single params Object can have the following properties:
// markup -- String, a string of markup with vars to interpolate
//    if this exists, markupFile will be ignored
// markupFile -- String, a path to a file containing string data
//    then used to set the markup prop
// data -- Object, keyword/vals to use for the variable substitution
// requireAllKeys -- Boolean, if set to true, any variables in the
//    template file that don't have corresponding keys in the
//    data object will still show in the template as
//    ${ variable_name }. If set to false, those variables in
//    the template are replaced with empty strings
// preventCache -- Boolean, setting to true will always pull
//    down a fresh copy of the template -- otherwise the template
//    string gets stored in fleegix.template.templateTextCache so that
//    different UI elements sharing the same template file won't
//    all have to make the server round-trip to get their template
//    string.
fleegix.template.Templater = function (p) {
  var params = p || {};
  var opts = params.options || {};
  this.markup = params.markup || '';
  this.markupFile = '';
  this.data = params.data || {};
  this.requireAllKeys = typeof params.requireAllKeys == 'boolean' ?
    params.requireAllKeys : true;
  if (!this.markup) {
    var _this = this;
    var noCache = typeof this.preventCache == 'undefined' ?
      false : this.preventCache;
    this.markupFile = params.markupFile;
    var s = fleegix.template.templateTextCache[this.markupFile];
    if (!s || noCache) {
      var p = {
        url: this.markupFile,
        method: 'GET',
        preventCache: noCache,
        async: false
      };
      s = fleegix.xhr.doReq(p);
      fleegix.template.templateTextCache[this.markupFile] = s;
    }
    this.markup = s;
  }
};
fleegix.template.Templater.prototype.templatize =
  function (domNode) {
  var str = this.getTemplatedMarkup();
  domNode.innerHTML = str;
  return domNode;
};
fleegix.template.Templater.prototype.getTemplatedMarkup =
  function () {
  var pat = /\$\{ *(.*?) *\}/g;
  var subPat = /[${} ]/g;
  var str = this.markup;
  var match = str.match(pat);
  if (match) {
    for (var i = 0; i < match.length; i++) {
      m = match[i];
      key = m.replace(subPat, '');
      var data = this.data[key] ? this.data[key] : '';
      if (data || !this.requireAllKeys) {
        str = str.replace(m, data);
      }
    }
  }
  return str;
};
fleegix.template.templateTextCache = {};



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
    var domNode = params.node;
    // Cache/reuse the generated template source for speed
    this.source = this.source || '';
    if (!this.source) { this.generateSource(); }
    
    // Eval the template with the passed data
    // Use 'with' to give local scoping to data obj props
    // ========================
    var _output = ''; // Inner scope var for eval output
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
    var _this = this;
    var _addOutput = function () {
      line = line.replace(/\n/, '\\n');
      line = line.replace(/"/g, '\\"');
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
              this.source += line;
              break;
            // Exec and output
            case this.modes.OUTPUT:
              // Add the exec'd result to the output
              this.source += '_output += ' + line + ';';
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



if (typeof fleegix.form == 'undefined') { fleegix.form = {}; }
if (typeof fleegix.form.toObject == 'undefined') {
  throw('fleegix.form.diff depends on the base fleegix.form module in fleegix.js.'); }

fleegix.form.diff = function (formUpdated, formOrig, opts) {
  var o = opts || {};
  // Accept either form or hash-conversion of form
  var hUpdated = formUpdated.elements ?
    fleegix.form.toObject(formUpdated) : formUpdated;
  var hOrig = formOrig.elements ?
    fleegix.form.toObject(formOrig) : formOrig;
  var diffs = [];
  var count = 0;

  function addDiff(n, hA, hB, secondPass) {
    if (!diffs[n]) {
      count++;
      diffs[n] = secondPass?
        { origVal: hB[n], newVal: hA[n] } :
        { origVal: hA[n], newVal: hB[n] };
    }
  }

  function diffSweep(hA, hB, secondPass) {
    for (n in hA) {
      // Elem doesn't exist in B
      if (typeof hB[n] == 'undefined') {
        // If intersectionOnly flag set, ignore stuff that's
        // not in both sets
        if (o.intersectionOnly) { continue; };
        // Otherwise we want the union, note the diff
        addDiff(n, hA, hB, secondPass);
      }
      // Elem exists in both
      else {
        v = hA[n];
        // Multi-value -- array, hA[n] actually has values
        if (v instanceof Array) {
          if (!hB[n] || (hB[n].toString() != v.toString())) {
            addDiff(n, hA, hB, secondPass);
          }
        }
        // Single value -- null or string
        else {
          if (hB[n] != v) {
            addDiff(n, hA, hB, secondPass);
          }
        }
      }
    }
  }
  // First sweep check all items in updated
  diffSweep(hUpdated, hOrig, false);
  // Second sweep, check all items in orig
  diffSweep(hOrig, hUpdated, true);

  // Return an obj with the count and the hash of diffs
  return {
    count: count,
    diffs: diffs
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


if (typeof fleegix.event == 'undefined') {
  throw('fleegix.event.delegator depends on the base fleegix.event module in fleegix.js.'); }

fleegix.event.Delegator = function (containerNode, actions,
  options) {
  var _this = this;
  this.containerNode = containerNode;
  // List of CSS class names and their corresponding
  // click-actions
  this.actions = actions || {};
  // Optional execution context for called actions
  var opts = options || {};
  this.context = opts.context || null;
  // Assume we want to stop any further action
  this.stopPropagation =
    typeof opts.stopPropagation != 'undefined' ?
    opts.stopPropagation : true;
  this.preventDefault =
    typeof opts.preventDefault != 'undefined' ?
    opts.preventDefault : true;

  // Add another action
  this.addClickAction = function (className, act) {
    this.actions[className] = act;
  };
  this.getClickAction = function (e) {
    var actions = this.actions;
    var containerNode = this.containerNode;
    var node = e.target;
    var topNode = containerNode || document.body;
    // Look upward from the click target to the
    // a predefined parent -- if any of the parentNodes
    // have an action class attached, return the
    // class and bail out
    while (node.parentNode && node != topNode) {
      if (node.className) {
        for (var c in actions) {
          // Look through class name(s) set on the node
          var names = node.className.split(' ');
          for (var i = 0; i < names.length; i++) {
            if (names[i] == c) {
              return c;
            }
          }
        }
      }
      node = node.parentNode;
    }
    return null;
  };
  this.handleClick = function (e) {
    var context = this.context;
    var key = _this.getClickAction(e);
    // If there's a CSS class in the click chain with
    // a matching action, exec the action
    if (key) {
      var act = this.actions[key];
      if (context) {
        act.call(context, e);
      }
      else {
        act(e);
      }
      if (this.stopPropagation) {
        fleegix.event.stopPropagation(e);
      }
      if (this.preventDefault) {
        fleegix.event.preventDefault(e);
      }
    }
  };
  fleegix.event.listen(containerNode, 'onclick',
    this, 'handleClick');
};


if (typeof fleegix.event == 'undefined') {
  throw('fleegix.event.delegator depends on the base fleegix.event module in fleegix.js.'); }

fleegix.event.Periodic = function () {
  var _this = this;
  var _paused = false;

  var args = Array.prototype.slice.apply(arguments);
  var context;
  var methodName;
  if (typeof args[0] != 'function') {
    context = args.shift();
    methodName = args.shift();
  }
  else {
    var func = args.shift();
  }
  var interval = args.shift();
  var waitFirst = args.shift();

  this.context = context || null;
  this.methodName = methodName || null;
  this.func = func || null;
  this.interval = interval || null;
  this.waitFirst = waitFirst || false;
  this.start = function (waitFirst) {
    this.waitFirst = waitFirst || this.waitFirst;
    if (this.waitFirst) {
      setTimeout(this.run, this.interval);
    }
    else {
      this.run();
    }
  };
  this.run = function () {
    if (!_paused) {
      if (_this.context) {
        _this.context[_this.methodName].call(_this.context);
      }
      else {
        _this.func();
      }
      setTimeout(_this.run, _this.interval);
    }
  };
  this.pause = function () {
    _paused = true;
  };
  this.resume = function () {
    _paused = false;
    this.run();
  };
};

// Clean up listeners
fleegix.event.listen(window, 'onunload', function () {
  try {
    fleegix.event.flush();
  }
  catch (e) {} // Squelch
});

/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
if (typeof fleegix == 'undefined') {
  throw new Error('fleegix.history depends on fleegix base module.');
}
fleegix.history = new function () {
  var _this = this;
  // Private vars
  var _historyCheck;
  var _ieHistory = 0;

  // Public vars
  this.index = 0;
  this.currentStep = 0;
  this.entries = [];
  this.entriesMap = {};
  this.ieKeyArray = [];
  this.bookmarkable = true;
  this.domain = null;

  // Private methods
  var _getHistoryDoc = function () {
    var doc;
    if (fleegix.ua.isIE) {
      doc = document.getElementById(
        "historyFrame").contentWindow.document;
    }
    else {
      // Show the hash in the main document
      if (_this.bookmarkable) {
        doc = document;
      }
      // Hide the hash in the iframe
      else {
        doc = document.getElementById(
          "historyFrame").contentDocument;
      }
    }
    return doc;
  };
  var _getHistoryStep = function () {
    var ret;
    if (fleegix.ua.isIE) {
      ret = _ieHistory;
    }
    else {
      ret = _getHistoryDoc().location.hash.replace('#', '');
      ret = _this.entriesMap[ret];
    }
    if (!isNaN(ret)) {
      ret = parseInt(ret, 10);
    }
    else {
      ret = 0;
    }
    return ret;
  };
  var _doHistoryCheck = function () {
    var step = _getHistoryStep();
    var entry;
    if (step != fleegix.history.currentStep) {
      fleegix.history.currentStep = _getHistoryStep();
      entry = _this.getEntry(fleegix.history.currentStep);
      fleegix.history.onchange(entry);
    }
    _historyCheck = null;
    _historyCheck = window.setTimeout(_doHistoryCheck, 200);
  };

  // Public methods
  this.init = function (entry) {
    var form = $('historyForm');
    var entries = form.historyEntries.value;
    if (entries.length) {
      var deserial = fleegix.json.parse(entries);
      for (var p in deserial) {
        this[p] = deserial[p];
      }
    }
    else {
      this.addEntry(entry);
    }
    if (!document.getElementById("historyFrame")) {
      throw new Error(
        'This history code requires an iframe with the id of ' +
        '"historyFrame" to exist in the initial page load.');
    }
    // Set-up the polling:
    _historyCheck = window.setTimeout(_doHistoryCheck, 200);
    fleegix.event.listen(window, 'onbeforeunload', fleegix.history,
      'finish');
  };

  this.addEntry = function () {
    var key;
    var entry;
    if (arguments.length == 1) {
      entry = arguments[0];
    }
    else {
      key = arguments[0];
      entry = arguments[1];
    }
    var curr = this.currentStep;
    var start = curr + 1;
    var removeCount = this.entries.length - curr;
    this.entries.splice(start, removeCount);
    this.entries.push(entry);
    this.index = this.entries.length - 1;
    key = key || this.index;
    return this.incrementHistory(key);
  };
  this.getEntry = function (i) {
    return this.entries[i];
  };
  this.incrementHistory = function (key) {
    var doc = _getHistoryDoc();
    this.currentStep = this.index;
    this.entriesMap[key] = this.index;
    // Use the document.write hack to avoid needless
    // round-trip in IE
    if (fleegix.ua.isIE) {
      var docDomain = this.domain ?
          'document.domain="' + this.domain + '";' : '';
      _this.ieKeyArray[this.index] = key;
      doc.open("javascript:'<html></html>'");
      doc.write('<html><head><scri' +
        'pt type="text/javascript">' + docDomain +
        'parent.fleegix.history.' +
        'onIncremented(' + this.index + ');</scri' +
        'pt></head><body></body></html>');
      doc.close();
    }
    // Safari doesn't update the history for changes
    // to iframe hashes -- doing a fake form post
    // to the hash gets around this. No round-trip
    // seems to occur here
    else if (fleegix.ua.isSafari && !this.bookmarkable) {
      doc.body.innerHTML = '<form name="x" action="#' +
        this.index + '" method="GET"></form>';
      doc.forms[0].submit();
    }
    else {
      if (key != 0) {
        doc.location.hash = '#' + key;
      }
    }
    this.index++;
    _this.serializeHistory();
    return true;
  };
  this.onIncremented = function (i) {
    _ieHistory = i;
    if (_this.bookmarkable) {
      if (i == 0) {
        location.hash = '';
      }
      else {
        location.hash = '#' + _this.ieKeyArray[i];
      }
    }
  };
  this.serializeHistory = function () {
    if (_this.entries.length > 0) {
      var form = $('historyForm');
      var serial = {
        entries: _this.entries,
        entriesMap: _this.entriesMap,
        ieKeyArray: _this.ieKeyArray
      };
      serial = fleegix.json.serialize(serial);
      form.historyEntries.value = serial;
    }
  };
  this.finish = function () {
    _this.serializeHistory();
    if (_historyCheck) {
      window.clearTimeout(_historyCheck);
    }
  };
  this.onchange = function () {};
};


if (typeof fleegix.string == 'undefined') { fleegix.string = {}; }
fleegix.string.hotlink = new function () {
  var _this = this;
  var _hrefPat = /(https?:\/\/|www.)([-\w]+(?:\.[-\w]+)*(:\d+)?(\/(([~\w\+%-]|([,.;@:][^\s$]))+)?)*((\?|;)[\w\+%&=.;:-]+)?(\#[\w\-\.]*)?)/g;
  var _emailPat = /[\w\.\+-=]+@[\w\.-]+\.[\w]{2,3}/g;  
  this.url = function (str) {
    var t = str || '';
    ret = t.replace(_hrefPat, function (s) {
      // Prepend http:// for www-only URLs
      var href = s.indexOf('www') === 0 ? 'http://' + s : s;
      return '<a href="' + href + '">' + s + '</a>';
    });
    return ret;
  };
  this.email = function (str) {
    var t = str || '';
    ret = t.replace(_emailPat, function (s) {
      return '<a href="mailto:' + s + '">' + s + '</a>';
    });
    return ret;
  };
  this.all = function (str) {
    var t = str || '';
    t = _this.url(t);
    t = _this.email(t);
    return t;
  };
};



if (typeof fleegix.string == 'undefined') { fleegix.string = {}; }

fleegix.string.truncate = function (str, len, tail) {
  var t = tail || '';
  if (str.length > len) {
    return str.substr(0, (len - t.length)) + t;
  }
  else {
    return str;
  }
};

fleegix.string.truncateHTML = function (str, len, tail) {
  // The returned string of content
  var s = '';
  // Any tail to append after truncation -- e.g. ellipses
  var t = tail || '';
  // Split pattern for HTML tags
  var pat = /(<[^>]*>)/;
  // Opening HTML tag -- used as a flag that there's an
  // HTML tag sitting open when truncation happens
  var openTag = null;
  // Used to close any open tag
  var closeTag = '';
  // An array of merged content and tags, e.g., ['foo',
  // '<strong>', 'bar', '</strong>']
  var arr = [];
  // Current length of the string to return
  var currLen = 0;
  // Lookahead to see if we'll overshoot the max length
  var nextLen = 0;
  // Truncated final segment of the string
  var trunc;
  // Each item in the merged tag/content array
  var item;

  // Build the merged array of tags/content
  var result = pat.exec(str);
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

  // Parse each item in the tag/content array
  // Have to parse in all cases -- no simple test to see
  // if you can just return the entire string
  // Global regex replace would work, but who knows
  // how much if any faster that is
  for (var i = 0; i < arr.length; i++) {
    item = arr[i];
    switch (true) {
      // Closing tag
      case item.indexOf('</') == 0:
        s += item;
        openTag = null;
        break;
      // Opening tag
      case item.indexOf('<') == 0:
        s += item;
        openTag = item;
        break;
      // Text
      default:
        nextLen += item.length;
        // If adding the content will overshoot the limit
        // use the truncation fu
        if (nextLen >= len) {
          // Chop the string to the amount needed to complete
          // the max length, minus the amount for the tail string if any
          // NOTE: Content segment can be less than the length of the
          // tail string -- this can result in a fudge factor of the length
          // of the tail for the entire string
          trunc = item.substr(0, (len - currLen) - t.length);
          s += trunc;
          // If we're sitting on an open HTML tag
          if (openTag) {
            // If there's content in the final truncated string,
            // just append a closing tag of the same kind as
            // the opening tag
            if (trunc.length) {
              closeTag = openTag.split(
                  /\s|>/)[0].replace('<', '</') + '>';
              s += closeTag;
            }
            // If there's no content in the truncated string,
            // just strip out the previous open tag
            else {
              s = s.replace(openTag, '');
            }
          }
          // Append the tail, if any, and return
          s += t;
          return s;
        }
        else {
          s += item;
        }
        currLen = nextLen;
      }
  }
  return s;
};



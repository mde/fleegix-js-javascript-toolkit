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


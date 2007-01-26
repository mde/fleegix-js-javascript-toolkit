/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
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
fleegix.fx = new function () {
  
  function doFade(elem, opts, dir) {
    var s = dir == 'in' ? 0 : 100;
    var e = dir == 'in' ? 100 : 0;
    var o = {
      startVal: s, 
      endVal: e,
      props: { opacity: [s, e] },
      trans: 'lightEaseIn' };
    for (p in opts) {
      o[p] = opts[p];
    }
    return new fleegix.fx.Effecter(elem, o);
  }
  
  this.fadeOut = function (elem, opts) {
    return doFade(elem, opts, 'out');
  };
  this.fadeIn = function (elem, opts) {
    return doFade(elem, opts, 'in');
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
    else if (p.toLowerCase().indexOf('color') > -1) {
      elem.style[p] = v;
    }
    else {
      elem.style[p] = document.all ? 
        parseInt(v) + 'px' : v + 'px';
    }
    return true;
  };
  this.hexPat = /^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
  this.hexToRGB = function (str, returnArray) {
    var rgb = [];
    var h = str.match(this.hexPat);
    if (h) {
      for (var i = 1; i < h.length; i++) {
        var s = h[i];
        s = s.length == 1 ? s + s : s;
        rgb.push(parseInt(s, 16));
      }
      s = 'rgb(' + rgb.join() + ')';
      return returnArray ? rgb : s;
    }
    else {
      throw('"' + str + '" not a valid hex value.');
    }
  };
};

fleegix.fx.Effecter = function (elem, opts) {
  var self = this;
  this.props = opts.props;
  this.trans = opts.trans || 'linear';
  this.duration = opts.duration || 500;
  this.fps = 30;
  this.startTime = new Date().getTime();
  this.timeSpent = 0;
  this.doAfter = opts.doAfter || null;
  this.autoStart = opts.autoStart == false ? false : true;
  
  if (typeof this.transitions[this.trans] != 'function') {
    throw('"' + this.trans + '" is not a valid transition.');
  }
  
  this.start = function () {
    self.id = setInterval( function () { 
      self.doStep.apply(self, [elem]) }, 
      Math.round(1000/self.fps));
    // Run the pre-execution func if any
    if (typeof opts.doOnStart == 'function') {
      opts.doOnStart();
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
      fleegix.fx.setCSSProp(elem, i, p[i][1]);
    }
    clearInterval(this.id);
    // Run the post-execution func if any
    if (typeof this.doAfterFinished == 'function') {
      this.doAfterFinished();
    }
  }
};

fleegix.fx.Effecter.prototype.calcCurrVal = function (key) {
  var startVal = this.props[key][0];
  var endVal = this.props[key][1];
  var trans = this.transitions[this.trans];
  if (key.toLowerCase().indexOf('color') > -1) {
    var arrStart = fleegix.fx.hexToRGB(startVal, true);
    var arrEnd = fleegix.fx.hexToRGB(endVal, true);
    var arrCurr = [];
    for (var i = 0; i < arrStart.length; i++) {
      var s = arrStart[i];
      var e = arrEnd[i];
      arrCurr.push(parseInt(trans(this.timeSpent, s, (e - s), this.duration)));
    }
    return 'rgb(' + arrCurr.join() + ')';
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
    if ((t/=d/2) < 1) return c/2*t*t + b;
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
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  }
};


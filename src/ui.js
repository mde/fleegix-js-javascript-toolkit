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
fleegix.ui = new function () {
  this.getViewportWidth = function () {
    // IE
    if (document.all) {
      if (document.documentElement && 
        document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
      }
      else {
        return document.body.clientWidth;
      }
    }
    // Moz/compat
    else {
      return window.innerWidth;
    }
  };
  this.getWindowWidth = this.getViewportWidth;
  this.getViewportHeight = function () {
    // IE
    if (document.all) {
      if (document.documentElement && 
        document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
      }
      else {
        return document.body.clientHeight;
      }
    }
    // Moz/compat
    else {
      return window.innerHeight;
    }
  };
  this.getWindowHeight = this.getViewportHeight;
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
  else {
    elem.style[p] = document.all ? 
      parseInt(v) + 'px' : v + 'px';
  }
  return true;
};
  this.fadeOut = function (elem, opts) {
    var o = {
      startVal: 100, 
      endVal: 0,
      prop: 'opacity' };
    for (p in opts) {
      o[p] = opts[p];
    }
    var f = new fleegix.ui.Fx(elem, o);
  };
  this.fadeIn = function (elem, opts) {
    var o = {
      startVal: 0, 
      endVal: 100,
      prop: 'opacity' };
    for (p in opts) {
      o[p] = opts[p];
    }
    var f = new fleegix.ui.Fx(elem, o);
  };
};

fleegix.ui.Fx = function (elem, opts) {
  var self = this;
  this.prop = opts.prop;
  this.duration = opts.duration || 500;
  this.fps = 30;
  this.startVal = opts.startVal;
  this.endVal = opts.endVal;
  this.currVal = this.startVal;
  this.startTime = new Date().getTime();
  this.timeSpent = 0;
  this.doAfter = opts.doAfter || null;
  // Fire it up
  this.id = setInterval( function () { 
    self.doStep.apply(self, [elem]) }, 
    Math.round(1000/this.fps));
  // Run the pre-execution func if any
  if (typeof opts.doOnStart == 'function') {
    opts.doOnStart();
  }
}

fleegix.ui.Fx.prototype.doStep = function (elem) {
  var t = new Date().getTime();
  // Still going ...
  if (t < (this.startTime + this.duration)) {
    this.timeSpent = t - this.startTime;
    this.currVal = this.calcCurrVal();
    fleegix.ui.setCSSProp(elem, this.prop, this.currVal);
  }
  // All done, ya-hoo
  else {
    clearInterval(this.id);
    // Run the post-execution func if any
    if (typeof this.doAfterFinished == 'function') {
      this.doAfterFinished();
    }
  }
};

fleegix.ui.Fx.prototype.calcCurrVal = function () {
  return this.trans(this.timeSpent, this.startVal, 
    (this.endVal - this.startVal), this.duration); 
};

fleegix.ui.Fx.prototype.trans = function(timeSpent, 
  fromVal, valDiff, duration) {
 // Simple linear
 return valDiff * (timeSpent / duration) + fromVal;
}


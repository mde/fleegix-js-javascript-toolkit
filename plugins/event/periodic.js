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
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
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


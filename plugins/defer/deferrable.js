/*
 * Copyright 2008 Matthew Eernisse (mde@fleegix.org)
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

fleegix.defer = {
  statuses: {
    SUCCESS: 'success',
    FAILURE: 'failure'
  }
};
fleegix.defer.Deferrable = function (p) {
  var params = p || {};
  this.completed = false;
  this.stat = null;
  this.callbacks = [];
  this.errbacks = [];
  this.paused = false;
  this.timeout = null;
  this.setSuccess = function () {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(fleegix.defer.statuses.SUCCESS);
    this.setDeferredStatus.apply(this, args);
  };
  this.setFailure = function () {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(fleegix.defer.statuses.FAILURE);
    this.setDeferredStatus.apply(this, args);
  };
  this.setDeferredStatus = function () {
    if (this.paused) { return; }
    var _this = this;
    var args = Array.prototype.slice.apply(arguments);
    var funcs;
    var func;
    this.stat = args.shift();
    if (this.stat ==
      fleegix.defer.statuses.SUCCESS) {
      funcs = this.callbacks;
    }
    else if (this.stat ==
      fleegix.defer.statuses.FAILURE) {
      funcs = this.errbacks;
    }
    else {
      throw new Error('"' + this.stat +
      '" is not a valid status.');
    }
    if (funcs.length) {
      func = funcs.shift();
      this.args = args.slice();
      func.apply(window, args);
      args.unshift(this.stat);
      this.setDeferredStatus.apply(this, args);
    }
    else {
      this.completed = true;
    }
  };
  this.addCallback = function (func) {
    this.addFunc(fleegix.defer.statuses.SUCCESS,
      func);
    return this;
  };
  this.addErrback = function (func) {
    this.addFunc(fleegix.defer.statuses.FAILURE,
      func);
    return this;
  };
  this.addFunc = function (stat, func) {
    if (this.completed && this.stat == stat) {
      func.apply(window, this.args);
    }
    else {
      var funcs = stat == fleegix.defer.statuses.SUCCESS ?
        this.callbacks : this.errbacks;
      funcs.push(func);
    }
  };
  this.abort = function () {
    this.callbacks = [];
    this.errbacks = [];
  };
  this.pause = function () {
    this.paused = true;
  };
  this.resume = function () {
    this.paused = false;
    var args = Array.prototype.slice.apply(this.args);
    args.unshift(this.stat);
    this.setDeferredStatus.apply(this, args);
  };

  // Add any callbacks/errbacks in the constructor
  if (params.callback) {
    this.addCallback(params.callback);
  }
  if (params.errback) {
    this.addErrback(params.errback);
  }
};



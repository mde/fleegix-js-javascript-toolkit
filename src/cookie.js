/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.cookie = new function() {
  this.set = function(name, value, optParam) {
    var opts = optParam || {}
    var exp = '';
    var t = 0;
    if (typeof optParam == 'object') {
      var path = opts.path || '/';
      var days = opts.days || 0;
      var hours = opts.hours || 0;
      var minutes = opts.minutes || 0;
    }
    else {
      var path = optsParam || '/';
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
      if (c.indexOf(nameEq) == 0) {
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
}
fleegix.cookie.constructor = null; 


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
fleegix.uri = new function () {
  var self = this;

  this.params = {};

  this.getParamHash = function (str) {
    var q = str || self.getQuery();
    var d = {};
    if (q) {
      var arr = q.split('&');
      for (var i = 0; i < arr.length; i++) {
        var pair = arr[i].split('=');
        var name = pair[0];
        var val = pair[1];
        if (typeof d[name] == 'undefined') {
          d[name] = val;
        }
        else {
          if (!(d[name] instanceof Array)) {
            var t = d[name];
            d[name] = [];
            d[name].push(t);
          }
          d[name].push(val);
        }
      }
    }
    return d;
  };
  this.getParam = function (name, str) {
    var p = null;
    if (str) {
      var h = this.getParamHash(str);
      p = h[name];
    }
    else {
      p = this.params[name];
    }
    return p;
  };
  this.setParam = function (name, val, str) {
    var ret = null;
    // If there's a query string, set the param
    if (str) {
      var pat = new RegExp('(^|&)(' + name + '=[^\&]*)(&|$)');
      var arr = str.match(pat);
      // If it's there, replace it
      if (arr) {
        ret = str.replace(arr[0], arr[1] + name + '=' + val + arr[3]);
      }
      // Otherwise append it
      else {
        ret = str + '&' + name + '=' + val;
      }
    }
    // Otherwise create a query string with just that param
    else {
      ret = name + '=' + val;
    }
    return ret;
  };
  this.getQuery = function (s) {
    var l = s ? s : location.href;
    return l.split('?')[1];
  };
  this.getBase = function (s) {
    var l = s ? s : location.href;
    return l.split('?')[0];
  };
  this.params = this.getParamHash();
};

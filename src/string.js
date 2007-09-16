/*
 * Copyright 2007 Matthew Eernisse (mde@fleegix.org)
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
if (typeof fleegix == "undefined") fleegix = {};

fleegix.string = new function () {
  var ltr = /^\s+/; var rtr = /\s+$/; var tr = /^\s+|\s+$/g;
  this.toArray = function (str) {
    var arr = [];
    var x = str.replace(/.|\f|\t|\n|\r$/g,
      function (m, p) { (arr.push) ?
      arr.push(m) : arr[arr.length] = m; });
    return arr;
  };
  this.reverse = function (str) {
    return this.toArray(str).reverse().join('');
  };
  this.ltrim = function (str, chr) {
    var pat = chr ? new RegExp('^' + chr + '+') : ltr;
    return str.replace(pat, '');
  };
  this.rtrim = function (str, chr) {
    var pat = chr ? new RegExp(chr + '+$') : rtr;
    return str.replace(pat, '');
  };
  this.trim = function (str, chr) {
    var pat = chr ? new RegExp('^' + chr + '+|' + chr + '+$', 'g') : tr;
    return str.replace(pat, ''); 
  }
};


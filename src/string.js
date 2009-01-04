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
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.string = new function () {
  var ltr = /^\s+/; var rtr = /\s+$/; var tr = /^\s+|\s+$/g;
  var _hrefPat = new RegExp(
    "(((https?):\\/\\/|www\\.)" + // Protocol or just 'www'
    "(?:([a-zA-Z\\d\\-_]+)@?" + // Username
    "([a-zA-Z\\d\\-_]+)\\:)?((?:(?:(?:(?:[a-zA-Z\\d](?:(?:[a-zA-Z\\d]|-)*[a-zA-Z\\d])?)\\.)*([a-zA-Z](?:(?:[a-zA-Z\\d]|-)*[a-zA-Z\\d])?))|(?:(?:\\\d+)(?:\\.(?:\\\d+)){3}))(?::(\\\d+))?)" + // Hostname
    "(?:\\/((?:(?:(?:[a-zA-Z\\d$\\-_.+!*'(),~#]|(?:%[a-fA-F\\\d]{2}))|[;:@&=#])*)(?:\\/(?:(?:(?:[a-zA-Z\\d$\\-_.+!*'(),~#]|(?:%[a-fA-F\\\d]{2}))|[;:@&=#])*))*)(\\?(?:(?:(?:[a-zA-Z\\d$\\-_.+!*'(),~#]|(?:%[a-fA-F\\\d]{2}))|[;:@&=#])*))?)?)", // Path
    "g"); // Global regex

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
  this.escapeXML = function (s) {
    return s.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').
      replace(/>/gm, '&gt;').replace(/"/gm, '&quot;');
  };
  this.unescapeXML = function (s) {
    return s.replace(/&amp;/gm, '&').replace(/&lt;/gm, '<').
      replace(/&gt;/gm, '>').replace(/&quot;/gm, '"');
  };
  this.addHrefLinks = function (str, cls) {
    var s = str || '';
    var pat = _hrefPat;
    var url;
    var start;
    var end;
    var match;
    var matches = {};
    while (match = pat.exec(s)) {
      url = match[0];
      // Get rid of any punctuation on the end, even
      // if they may be legal URL chars
      url = url.replace(/[,)\.\?\!]+$/, '');
      // Build a list of URLs to replace
      matches[url] = true;
    }
    // Can't use a regex to do global replace here, hack
    // it with split/join
    var arr;
    var href;
    var className = cls ? ' class="' + cls + '"' : '';
    for (var m in matches) {
      arr = s.split(m);
      href = m.indexOf('www') === 0 ? 'http://' + m : m;
      s = arr.join('<a' + className +
        ' href="' + href + '">' + m + '</a>');
    }
    return s;
  };
};


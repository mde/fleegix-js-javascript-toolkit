/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
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
if (typeof fleegix == 'undefined') { var fleegix = {}; }
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



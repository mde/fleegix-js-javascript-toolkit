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
if (typeof fleegix == 'undefined') { throw('Requires fleegix base namespace.'); }
if (typeof fleegix.xhr == 'undefined') { throw('Requires fleegix.xhr namespace.'); }
if (typeof fleegix.template == 'undefined') { fleegix.template = {}; }
// single params Object can have the following properties:
// markup -- String, a string of markup with vars to interpolate
//    if this exists, markupFile will be ignored
// markupFile -- String, a path to a file containing string data
//    then used to set the markup prop
// data -- Object, keyword/vals to use for the variable substitution
// requireAllKeys -- Boolean, if set to true, any variables in the
//    template file that don't have corresponding keys in the
//    data object will still show in the template as
//    ${ variable_name }. If set to false, those variables in
//    the template are replaced with empty strings
// preventCache -- Boolean, setting to true will always pull
//    down a fresh copy of the template -- otherwise the template
//    string gets stored in fleegix.template.markupCache so that
//    different UI elements sharing the same template file won't
//    all have to make the server round-trip to get their template
//    string.
fleegix.template.Templater = function (p) {
  var params = p || {}
  var opts = params.options || {};
  this.markup = params.markup || '';
  this.markupFile = '';
  this.data = params.data || {};
  this.requireAllKeys = typeof params.requireAllKeys == 'boolean' ?
    params.requireAllKeys : true;
  if (!this.markup) {
    var _this = this;
    var noCache = typeof this.preventCache == 'undefined' ?
      false : this.preventCache;
    this.markupFile = params.markupFile;
    var s = fleegix.template.markupCache[this.markupFile];
    if (!s || noCache) {
      var p = {
        url: this.markupFile,
        method: 'GET',
        preventCache: noCache,
        async: false
      };
      s = fleegix.xhr.doReq(p);
      fleegix.template.markupCache[this.markupFile] = s;
    }
    this.markup = s;
  }
}
fleegix.template.Templater.prototype.templatize =
  function (domNode) {
  var str = this.getTemplatedMarkup();
  domNode.innerHTML = str;
  return domNode;
}
fleegix.template.Templater.prototype.getTemplatedMarkup =
  function () {
  var pat = /\$\{ *(.*?) *}/g;
  var subPat = /[${} ]/g
  var str = this.markup;
  var match = str.match(pat);
  if (match) {
    for (var i = 0; i < match.length; i++) {
      m = match[i];
      key = m.replace(subPat, '');
      var data = this.data[key] ? this.data[key] : '';
      if (data || !this.requireAllKeys) {
        str = str.replace(m, data);
      }
    }
  }
  return str;
};
fleegix.template.markupCache = {};

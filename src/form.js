/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
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
 * Original code by Matthew Eernisse (mde@fleegix.org), March 2005
 * Additional bugfixes by Mark Pruett (mark.pruett@comcast.net), 12th July 2005
 * Multi-select added by Craig Anderson (craig@sitepoint.com), 24th August 2006
 *
*/

if (typeof fleegix == 'undefined') { var fleegix = {}; }
/**
 * Serializes the data from all the inputs in a Web form
 * into a query-string style string.
 * @param docForm -- Reference to a DOM node of the form element
 * @param formatOpts -- JS object of options for how to format
 * the return string. Supported options:
 *    collapseMulti: (Boolean) take values from elements that
 *    can return multiple values (multi-select, checkbox groups)
 *    and collapse into a single, comman-delimited value
 *    (e.g., thisVar=asdf,qwer,zxcv)
 * @returns query-string style String of variable-value pairs
 */
fleegix.form = {};
fleegix.form.serialize = function (f, o) {
  var h = fleegix.form.toHash(f);
  var opts = o || {};
  var str = '';
  var pat = null;

  if (opts.stripTags) { pat = /<[^>]*>/g; }
  for (var n in h) {
    var s = '';
    var v = h[n];
    if (v) {
      // Single val -- string
      if (typeof v == 'string') {
        s = opts.stripTags ? v.replace(pat, '') : v;
        str += n + '=' + encodeURIComponent(s);
      }
      // Multiple vals -- array
      else {
        var sep = ''; 
        if (opts.collapseMulti) {
          sep = ',';
          str += n + '=';
        }
        else {
          sep = '&';
        }
        for (var j = 0; j < v.length; j++) {
          s = opts.stripTags ? v[j].replace(pat, '') : v[j];
          s = (!opts.collapseMulti) ? n + '=' + encodeURIComponent(s) : 
            encodeURIComponent(s);
          str += s + sep;
        }
        str = str.substr(0, str.length - 1);
      }
      str += '&'
    }
    else {
      if (opts.includeEmpty) { str += n + '=&'; }
    }
  }
  str = str.substr(0, str.length - 1);
  return str;
};

fleegix.form.toHash = function (f) { 
  var h = {};
  
  function expandToArr(orig, val) {
    if (orig) {
      var r = null;
      if (typeof orig == 'string') {
        r = [];
        r.push(orig);
      }
      else {
        r = orig;
      }
      r.push(val);
      return r;
    }
    else {
      return val;
    }
  }
  
  for (i = 0; i < f.elements.length; i++) {
    elem = f.elements[i];
    
    switch (elem.type) {
      // Text fields, hidden form elements
      case 'text':
      case 'hidden':
      case 'password':
      case 'textarea':
      case 'select-one':
        h[elem.name] = elem.value;
        break;
        
      // Multi-option select
      case 'select-multiple':
        h[elem.name] = null;
        for(var j = 0; j < elem.options.length; j++) {
          var o = elem.options[j];
          if(o.selected) {
            h[elem.name] = expandToArr(h[elem.name], o.value);
          }
        }
        break;
      
      // Radio buttons
      case 'radio':
        if (typeof h[elem.name] == 'undefined') { h[elem.name] = null; }
        if (elem.checked) {
          h[elem.name] = elem.value; 
        }
        break;
        
      // Checkboxes
      case 'checkbox':
        if (typeof h[elem.name] == 'undefined') { h[elem.name] = null; }
        if (elem.checked) {
          h[elem.name] = expandToArr(h[elem.name], elem.value);
        }
        break;
        
    }
  }
  return h;
};

fleegix.form.restore = function (form, str) {
  var arr = str.split('&');
  var d = {};
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
  for (var i = 0; i < form.elements.length; i++) {
    elem = form.elements[i];
    if (typeof d[elem.name] != 'undefined') {
      val = d[elem.name];
      switch (elem.type) {
        case 'text':
          case 'hidden':
          case 'password':
          case 'textarea':
          case 'select-one':
          elem.value = decodeURIComponent(val);
          break;
        case 'radio':
          if (encodeURIComponent(elem.value) == val) {
            elem.checked = true; 
          }
          break;
        case 'checkbox':
          for (var j = 0; j < val.length; j++) {
            if (encodeURIComponent(elem.value) == val[j]) {
              elem.checked = true; 
            }
          }
          break;
        case 'select-multiple':
          for (var h = 0; h < elem.options.length; h++) {
            var opt = elem.options[h];
            for (var j = 0; j < val.length; j++) {
              if (encodeURIComponent(opt.value) == val[j]) {
                opt.selected = true; 
              }
            }
          }
          break;
      }
    }
  }
  return form;
};

fleegix.form.diff = function (formA, formB) {
  // Accept either form or hash-conversion of form
  var hA = formA.toString() == '[object HTMLFormElement]' ? 
    fleegix.form.toHash(formA) : formA;
  var hB = formB.toString() == '[object HTMLFormElement]' ? 
    fleegix.form.toHash(formB) : formB;
  var ret = {};
  
  ret.count = 0;
  ret.diffs = {};
  
  function addDiff(n) {
    ret.count++;
    ret.diffs[n] = [hA[n], hB[n]];
  }
 
  for (n in hA) {
    // Elem doesn't exist in B
    if (typeof hB[n] == 'undefined') {
      addDiff(n);
    }
    // Elem exists in both
    else {
      v = hA[n];
      // Multi-value -- array, hA[n] actually has values
      if (v instanceof Array) {
        if (!hB[n] || (hB[n].toString() != v.toString())) {
          addDiff(n);
        }
      }
      // Single value -- null or string
      else {
        if (hB[n] != v) {
          addDiff(n);
        }
      }
    }
  }
  return ret;
}










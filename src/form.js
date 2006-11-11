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
fleegix.form.serialize = function(docForm, formatOpts) {
  
  var opts = formatOpts || {};
  var s = '';
  var str = '';
  var formElem;
  var lastElemName = '';
  var pat = null;
  if (opts.stripTags) { pat = /<[^>]*>/g };
  
  for (i = 0; i < docForm.elements.length; i++) {
    formElem = docForm.elements[i];
    
    switch (formElem.type) {
      // Text fields, hidden form elements
      case 'text':
      case 'hidden':
      case 'password':
      case 'textarea':
      case 'select-one':
        s = opts.stripTags ? formElem.value.replace(pat, '') : formElem.value;
        if (s) {
          str += formElem.name + '=' + encodeURIComponent(s) + '&'
        }
        break;
        
      // Multi-option select
      case 'select-multiple':
        var isSet = false;
        for(var j = 0; j < formElem.options.length; j++) {
          var currOpt = formElem.options[j];
          if(currOpt.selected) {
            if (opts.collapseMulti) {
              if (isSet) {
                s = opts.stripTags ? currOpt.value.replace(pat, '') : currOpt.value;
                str += ',' + encodeURIComponent(s);
              }
              else {
                s = opts.stripTags ? currOpt.value.replace(pat, '') : currOpt.value;
                str += formElem.name + '=' + encodeURIComponent(s);
                isSet = true;
              }
            }
            else {
              s = opts.stripTags ? currOpt.value.replace(pat, '') : currOpt.value;
              str += formElem.name + '=' + encodeURIComponent(currOpt.value) + '&';
            }
          }
        }
        if (opts.collapseMulti) {
          str += '&';
        }
        break;
      
      // Radio buttons
      case 'radio':
        if (formElem.checked) {
          s = opts.stripTags ? formElem.value.replace(pat, '') : formElem.value;
          str += formElem.name + '=' + encodeURIComponent(formElem.value) + '&'
        }
        break;
        
      // Checkboxes
      case 'checkbox':
        if (formElem.checked) {
          // Collapse multi-select into comma-separated list
          if (opts.collapseMulti && (formElem.name == lastElemName)) {
            // Strip off end ampersand if there is one
            if (str.lastIndexOf('&') == str.length-1) {
              str = str.substr(0, str.length - 1);
            }
            // Append value as comma-delimited string
            s = opts.stripTags ? formElem.value.replace(pat, '') : formElem.value;
            str += ',' + encodeURIComponent(s);
          }
          else {
            s = opts.stripTags ? formElem.value.replace(pat, '') : formElem.value;
            str += formElem.name + '=' + encodeURIComponent(s);
          }
          str += '&';
          lastElemName = formElem.name;
        }
        break;
        
    }
  }
  // Remove trailing separator
  str = str.substr(0, str.length - 1);
  return str;
};

fleegix.form.restore = function(form, str) {
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
}


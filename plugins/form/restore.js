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
if (typeof fleegix.form == 'undefined') { fleegix.form = {}; }

fleegix.form.restore = function (form, str, o) {
  var opts = o || {};
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
        case 'submit':
        case 'reset':
        case 'file':
        case 'image':
        case 'button':
          if (opts.pedantic) {
            elem.value = decodeURIComponent(val);
          }
          break;
      }
    }
  }
  return form;
};


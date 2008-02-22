/*
 * Copyright 2007 Matthew Eernisse (mde@fleegix.org)
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
fleegix.html = new function () {
  var _createElem = function (s) {
    return document.createElement(s); };
  var _createText = function (s) {
    return document.createTextNode(s); };
  this.createSelect = function (o) {
    var sel = document.createElement('select');
    var options = [];
    var appendElem = null;

    // createSelect({ name: 'foo', id: 'foo', multi: true,
    //  options: [{ text: 'Howdy', value: '123' },
    //  { text: 'Hey', value: 'ABC' }], className: 'fooFoo' });
    appendElem = arguments[1];
    options = o.options;
    for (var p in o) {
      if (p != 'options') {
        sel[p] = o[p];
      }
    }
    // Add the options for the select
    if (options) {
      this.setSelectOptions(sel, options);
    }
    return sel;
  };

  this.setSelectOptions = function (selectElement, options){
    while (selectElement.firstChild){
       selectElement.removeChild(selectElement.firstChild);
    }
    for (var i = 0; i < options.length; i++) {
      var opt = _createElem('option');
      opt.value = options[i].value || '';
      opt.appendChild(_createText(options[i].text));
      selectElement.appendChild(opt);
      if (options[i].selected){
        selectElement.selectedIndex = i;
      }
    }
  };

  this.setSelect = function (sel, val) {
    var index = 0;
    var opts = sel.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value == val) {
        index = i;
        break;
      }
    }
    sel.selectedIndex = index;
  };

  this.createInput = function (o) {
    var input = null;
    var str = '';

    // createInput({ type: 'password', name: 'foo', id: 'foo',
    //    value: 'asdf', className: 'fooFoo' });
    // Neither IE nor Safari 2 can handle DOM-generated radio
    // or checkbox inputs -- they stupidly assume name and id
    // attributes should be identical. The solution: kick it
    // old-skool with conditional branching and innerHTML
    if ((document.all || navigator.userAgent.indexOf('Safari/41') > -1) &&
      (o.type == 'radio' || o.type == 'checkbox')) {
      str = '<input type="' + o.type + '"' +
        ' name="' + o.name + '"' +
        ' id ="' + o.id + '"';
      if (o.value) {
        str += ' value="' + o.value + '"';
      }
      if (o.size) {
        str += ' size="' + o.size + '"';
      }
      if (o.maxlength) {
        str += ' maxlength="' + o.maxlength + '"';
      }
      if (o.checked) {
        str += ' checked="checked"';
      }
      if (o.className) {
        str += ' class="' + o.className + '"';
      }
      str += '/>';

      var s = _createElem('span');
      s.innerHTML = str;
      input = s.firstChild;
      s.removeChild(input);
    }
    // Standards-compliant browsers -- all form inputs
    // IE/Safari 2 -- everything but radio button and checkbox
    else {
      input = document.createElement('input');
      for (var p in o) {
        input[p] = o[p];
      }

    }
    return input;
  };

};

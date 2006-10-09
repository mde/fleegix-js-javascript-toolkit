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
  var str = '';
  var formElem;
  var lastElemName = '';
  
  for (i = 0; i < docForm.elements.length; i++) {
    formElem = docForm.elements[i];
    
    switch (formElem.type) {
      // Text fields, hidden form elements
      case 'text':
      case 'hidden':
      case 'password':
      case 'textarea':
      case 'select-one':
        str += formElem.name + '=' + encodeURI(formElem.value) + '&'
        break;
        
      // Multi-option select
      case 'select-multiple':
        var isSet = false;
        for(var j = 0; j < formElem.options.length; j++) {
          var currOpt = formElem.options[j];
          if(currOpt.selected) {
            if (opts.collapseMulti) {
              if (isSet) {
                str += ',' + encodeURI(currOpt.value);
              }
              else {
                str += formElem.name + '=' + encodeURI(currOpt.value);
                isSet = true;
              }
            }
            else {
              str += formElem.name + '=' + encodeURI(currOpt.value) + '&';
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
          str += formElem.name + '=' + encodeURI(formElem.value) + '&'
        }
        break;
        
      // Checkboxes
      case 'checkbox':
        if (formElem.checked) {
          // Collapse multi-select into comma-separated list
          if (opts.collapseMulti && (formElem.name == lastElemName)) {
            // Strip of end ampersand if there is one
            if (str.lastIndexOf('&') == str.length-1) {
              str = str.substr(0, str.length - 1);
            }
            // Append value as comma-delimited string
            str += ',' + encodeURI(formElem.value);
          }
          else {
            str += formElem.name + '=' + encodeURI(formElem.value);
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


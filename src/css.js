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
fleegix.css = new function() {
    this.addClass = function (elem, s) {
        fleegix.css.removeClass(elem, s); // Don't add twice
        var c = elem.className;
        elem.className = c += ' ' + s;
    };
    this.removeClass = function (elem, s) {
        var c = elem.className;
        // Esc backslashes in regex pattern
        var pat = '\\b' + s + '\\b';
        pat = new RegExp(pat);
        c = c.replace(pat, '');
        elem.className = c;
    };
};


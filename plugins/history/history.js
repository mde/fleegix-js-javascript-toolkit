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
*/
if (typeof fleegix == 'undefined') {
  throw new Error('fleegix.history depends on fleegix base module.');
}
fleegix.history = new function () {
  // Private vars
  var _historyCheck;
  var _ieHistory = null;

  // Public vars
  this.index = 0;
  this.currentStep = null;
  this.entries = [];

  // Private methods
  var _getHistoryDoc = function () {
    var doc;
    if (fleegix.ua.isIE) {
      doc = document.getElementById(
        "historyFrame").contentWindow.document;
    }
    else {
      doc = document.getElementById(
        "historyFrame").contentDocument;
    }
    return doc;
  };
  var _getHistoryStep = function () {
    var ret;
    if (fleegix.ua.isIE) {
      ret = _ieHistory;
    }
    else {
      ret = _getHistoryDoc().location.hash.replace('#', '');
    }
    // This set of conditionals is really important,
    // since setting the _ieHistory var cross-window
    // results in loss of type information
    if (typeof ret == 'number' || (ret && ret.length)) {
      return parseInt(ret, 10);
    }
    else {
      return null;
    }
  };
  var _doHistoryCheck = function () {
    var step = _getHistoryStep();
    if (step != fleegix.history.currentStep) {
      fleegix.history.currentStep = _getHistoryStep();
      fleegix.history.onchange();
    }
    _historyCheck = null;
    _historyCheck = window.setTimeout(_doHistoryCheck, 200);
  };

  // Public methods
  this.init = function () {
    if (!document.getElementById("historyFrame")) {
      throw new Error(
        'This history code requires an iframe with the id of ' +
        '"historyFrame" to exist in the initial page load.');
    }
    // Set-up the polling:
    _historyCheck = window.setTimeout(_doHistoryCheck, 200);
    fleegix.event.listen(window, 'onunload', fleegix.history,
      'removeHistoryCheck');
  };

  this.addEntry = function (entry) {
    var curr = this.currentStep;
    var start = curr + 1;
    var removeCount = this.entries.length - curr;
    this.entries.splice(start, removeCount);
    this.entries.push(entry);
    this.index = this.entries.length - 1;
    return this.incrementHistory();
  };
  this.getEntry = function (i) {
    return this.entries[i];
  };
  this.incrementHistory = function () {
    var doc = _getHistoryDoc();
    this.currentStep = this.index;
    // Use the document.write hack to avoid needless
    // round-trip in IE
    if (fleegix.ua.isIE) {
      doc.open("javascript:'<html></html>'");
      doc.write('<html><head><scri' +
        'pt type="text/javascript">parent.fleegix.history.' +
        'onIncremented(' + this.index + ');</scri' +
        'pt></head><body></body></html>');
      doc.close();
    }
    // Safari doesn't update the history for changes
    // to iframe hashes -- doing a fake form post
    // to the hash gets around this. No round-trip
    // seems to occur here
    else if (fleegix.ua.isSafari) {
      doc.body.innerHTML = '<form name="x" action="#' +
        this.index + '" method="GET"></form>';
      doc.forms[0].submit();
    }
    else {
      doc.location.hash = '#' + this.index;
    }
    this.index++;
    return true;
  };
  this.onIncremented = function (i) {
    _ieHistory = i;
  };
  this.removeHistoryCheck = function () {
    if (_historyCheck) {
      window.clearTimeout(_historyCheck);
    }
  };
  this.onchange = function () {};
};


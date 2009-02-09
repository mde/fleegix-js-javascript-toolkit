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
  var _this = this;
  // Private vars
  var _historyCheck;
  var _ieHistory = 0;

  // Public vars
  this.index = 0;
  this.currentStep = 0;
  this.entries = [];
  this.entriesMap = {};
  this.ieKeyArray = [];
  this.bookmarkable = true;
  this.domain = null;

  // Private methods
  var _getHistoryDoc = function () {
    var doc;
    if (fleegix.ua.isIE) {
      doc = document.getElementById(
        "historyFrame").contentWindow.document;
    }
    else {
      // Show the hash in the main document
      if (_this.bookmarkable) {
        doc = document;
      }
      // Hide the hash in the iframe
      else {
        doc = document.getElementById(
          "historyFrame").contentDocument;
      }
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
      ret = _this.entriesMap[ret];
    }
    if (!isNaN(ret)) {
      ret = parseInt(ret, 10);
    }
    else {
      ret = 0;
    }
    return ret;
  };
  var _doHistoryCheck = function () {
    var step = _getHistoryStep();
    var entry;
    if (step != fleegix.history.currentStep) {
      fleegix.history.currentStep = _getHistoryStep();
      entry = _this.getEntry(fleegix.history.currentStep);
      fleegix.history.onchange(entry);
    }
    _historyCheck = null;
    _historyCheck = window.setTimeout(_doHistoryCheck, 200);
  };

  // Public methods
  this.init = function (entry) {
    var form = $('historyForm');
    var entries = form.historyEntries.value;
    if (entries.length) {
      var deserial = fleegix.json.parse(entries);
      for (var p in deserial) {
        this[p] = deserial[p];
      }
    }
    else {
      this.addEntry(entry);
    }
    if (!document.getElementById("historyFrame")) {
      throw new Error(
        'This history code requires an iframe with the id of ' +
        '"historyFrame" to exist in the initial page load.');
    }
    // Set-up the polling:
    _historyCheck = window.setTimeout(_doHistoryCheck, 200);
    fleegix.event.listen(window, 'onbeforeunload', fleegix.history,
      'finish');
  };

  this.addEntry = function () {
    var key;
    var entry;
    if (arguments.length == 1) {
      entry = arguments[0];
    }
    else {
      key = arguments[0];
      entry = arguments[1];
    }
    var curr = this.currentStep;
    var start = curr + 1;
    var removeCount = this.entries.length - curr;
    this.entries.splice(start, removeCount);
    this.entries.push(entry);
    this.index = this.entries.length - 1;
    key = key || this.index;
    return this.incrementHistory(key);
  };
  this.getEntry = function (i) {
    return this.entries[i];
  };
  this.incrementHistory = function (key) {
    var doc = _getHistoryDoc();
    this.currentStep = this.index;
    this.entriesMap[key] = this.index;
    // Use the document.write hack to avoid needless
    // round-trip in IE
    if (fleegix.ua.isIE) {
      var docDomain = this.domain ?
          'document.domain="' + this.domain + '";' : '';
      _this.ieKeyArray[this.index] = key;
      doc.open("javascript:'<html></html>'");
      doc.write('<html><head><scri' +
        'pt type="text/javascript">' + docDomain +
        'parent.fleegix.history.' +
        'onIncremented(' + this.index + ');</scri' +
        'pt></head><body></body></html>');
      doc.close();
    }
    // Safari doesn't update the history for changes
    // to iframe hashes -- doing a fake form post
    // to the hash gets around this. No round-trip
    // seems to occur here
    else if (fleegix.ua.isSafari && !this.bookmarkable) {
      doc.body.innerHTML = '<form name="x" action="#' +
        this.index + '" method="GET"></form>';
      doc.forms[0].submit();
    }
    else {
      if (key != 0) {
        doc.location.hash = '#' + key;
      }
    }
    this.index++;
    _this.serializeHistory();
    return true;
  };
  this.onIncremented = function (i) {
    _ieHistory = i;
    if (_this.bookmarkable) {
      if (i == 0) {
        location.hash = '';
      }
      else {
        location.hash = '#' + _this.ieKeyArray[i];
      }
    }
  };
  this.serializeHistory = function () {
    if (_this.entries.length > 0) {
      var form = $('historyForm');
      var serial = {
        entries: _this.entries,
        entriesMap: _this.entriesMap,
        ieKeyArray: _this.ieKeyArray
      };
      serial = fleegix.json.serialize(serial);
      form.historyEntries.value = serial;
    }
  };
  this.finish = function () {
    _this.serializeHistory();
    if (_historyCheck) {
      window.clearTimeout(_historyCheck);
    }
  };
  this.onchange = function () {};
};


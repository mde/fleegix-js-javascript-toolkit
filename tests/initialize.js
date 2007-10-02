
// Handy shortcut
var testWin = windmill.testWindow;

// Test namespace obj
testWin.fleegixTest = {};

// Convenience functions
testWin.$ = function (id) {
  return testWin.document.getElementById(id);
};
testWin._createElem = function (t) {
  return testWin.document.createElement(t);
};
testWin._createText = function (t) {
  return testWin.document.createTextNode(t);
};

windmill.jsTest.runInTestWindowScope = true;
windmill.jsTest.registerTestNamespace('fleegixTest');




fleegixMain.test_fleegixEvent = new function () {
  this.handleClick = function () {
    var d = $('clickHandlerTest');
    d.firstChild.nodeValue = 'I was just clicked, yay me!';
  };
  this.setup = function () {
    var d = $elem('div');
    d.id = 'clickHandlerTest';
    d.appendChild($text('Click Test'));
    fleegix.event.listen(d, 'onclick', test_fleegixEvent, 'handleClick');
    document.body.appendChild(d);
  };
  this.test_clickHandler = [
    { method: "click", params: { id: 'clickHandlerTest' } },
    { method: "asserts.assertText", params: { validator:
      'I was just clicked, yay me!', id: 'clickHandlerTest' } }
  ];
  this.teardown = function () {
    var d = $('clickHandlerTest');
    document.body.removeChild(d);
  };
};

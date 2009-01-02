
fleegixMain.test_fleegixEvent = new function () {
  var _handleClick = function () {
    var d = $('clickHandlerTest');
    d.firstChild.nodeValue = 'I was just clicked, yay me!';
  };
  this.test_addClickableNode = function () {
    var d = $elem('div');
    d.id = 'clickHandlerTest';
    d.appendChild($text('Click Test'));
    fleegix.event.listen(d, 'onclick', _handleClick);
    document.body.appendChild(d);
  };
  this.test_doClick = [
    {
      method: "waits.forElement",
      params: {
        id: 'clickHandlerTest' 
      }
    },
    { 
      method: "click",
      params: { id: 'clickHandlerTest' }
    },
    {
      method: "asserts.assertText",
      params: {
      validator: 'I was just clicked, yay me!',
        id: 'clickHandlerTest' 
      }
    }
  ];
  this.teardown = function () {
    var d = $('clickHandlerTest');
    document.body.removeChild(d);
  };
};

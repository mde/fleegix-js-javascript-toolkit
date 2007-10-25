
fleegixTest.test_cssAddClassName = [
  function () {
    var d = _createElem('div');
    d.id = 'fooDiv';
    d.innerHTML = 'Testing fleegix.css.addClass ...';
    document.body.appendChild(d);
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    fleegix.css.addClass(d, 'barClass');
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    jum.assertEquals('barClass', d.className);
  },
  function () {
    var d = $('fooDiv');
    document.body.removeChild(d);
  }
];

fleegixTest.test_cssRemoveClassName = [
  function () {
    var d = _createElem('div');
    d.id = 'fooDiv';
    d.innerHTML = 'Testing fleegix.css.removeClass ...';
    document.body.appendChild(d);
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    fleegix.css.addClass(d, 'barClass');
    fleegix.css.addClass(d, 'bazClass');
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    jum.assertEquals('barClass bazClass', d.className);
    fleegix.css.removeClass(d, 'barClass');
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    jum.assertEquals('bazClass', d.className);
  },
  function () {
    var d = $('fooDiv');
    document.body.removeChild(d);
  }
];



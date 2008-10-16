
fleegixMain.test_fleegixCss = new function () {
  this.test_addClassName = [
    function () {
      var d = $elem('div');
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

  this.test_removeClassName = [
    function () {
      var d = $elem('div');
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
};



fleegixTest.test_xhrDoGet = [
  function () {
    var d = _createElem('div');
    d.id = 'fooDiv';
    d.innerHTML = 'Testing fleegix.xhr.doGet ...';
    document.body.appendChild(d);
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    var f = function (s) {
      d.innerHTML = 'Data from server was "' + s + '"';
    };
    fleegix.xhr.doGet(f, location.href + 'xhr_response.php');
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    jum.assertEquals(d.innerHTML, 'Data from server was "method: get"');
  },
  function () {
    var d = $('fooDiv');
    document.body.removeChild(d);
  }
];

fleegixTest.test_xhrDoPost = [
  function () {
    var d = _createElem('div');
    d.id = 'fooDiv';
    d.innerHTML = 'Testing fleegix.xhr.doPost ...';
    document.body.appendChild(d);
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    var f = function (s) {
      d.innerHTML = 'Data from server was "' + s + '"';
    };
    var data = encodeURIComponent('some posted data');
    
    fleegix.xhr.doPost(f, location.href + 'xhr_response.php', 'data=' + data);
  },
  { method: "waits.sleep", params: { milliseconds: 800 } },
  function () {
    var d = $('fooDiv');
    jum.assertEquals(d.innerHTML, 'Data from server was "method: post, data: some posted data"');
  },
  function () {
    var d = $('fooDiv');
    document.body.removeChild(d);
  }
];




fleegixMain.test_fleegixXhr = new function () {
  function getCurrentDir() {
    var loc = location.href;
    var str = loc.substring(0, loc.lastIndexOf('/'));
    return str + '/';
  };

  this.test_doGet = [
    function () {
      var d = $elem('div');
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
      fleegix.xhr.doGet(f, getCurrentDir() + 'xhr_response.php');
    },
    { method: "waits.sleep", params: { milliseconds: 800 } },
    function () {
      var d = $('fooDiv');
      jum.assertEquals('Data from server was "method: get"', d.innerHTML);
    },
    function () {
      var d = $('fooDiv');
      document.body.removeChild(d);
    }
  ];

  this.test_doPost = [
    function () {
      var d = $elem('div');
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
      fleegix.xhr.doPost(f, getCurrentDir() + 'xhr_response.php', 'data=' + data);
    },
    { method: "waits.sleep", params: { milliseconds: 800 } },
    function () {
      var d = $('fooDiv');
      jum.assertEquals('Data from server was "method: post, data: some posted data"',
        d.innerHTML);
    },
    function () {
      var d = $('fooDiv');
      document.body.removeChild(d);
    }
  ];
};


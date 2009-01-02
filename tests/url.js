
fleegixMain.test_fleegixUrl = new function () {
  this.test_getQS = function () {
    var q = fleegix.url.getQS;
    var s = 'asdf=qwer&zxcv=uiop';
    var u = 'http://foo.bar/';
    jum.assertEquals(s, q(u + '?' + s));
    jum.assertEquals(s, q(u + ';' + s));
    jum.assertEquals(s, q('?' + s));
    jum.assertEquals(s, q(';' + s));
  };
  this.test_getBase = function () {
    var b = fleegix.url.getBase;
    var s = 'asdf=qwer&zxcv=uiop';
    var u = 'http://foo.bar/';
    jum.assertEquals(u, b(u + '?' + s));
    jum.assertEquals(u, b(u + ';' + s));
    jum.assertEquals(u, b(u));
  };
  this.test_getQSParam = function () {
    var g = fleegix.url.getQSParam;
    var s = 'asdf=qwer&zxcv=uiop';
    var u = 'http://foo.bar/?';
    jum.assertEquals('qwer', g(u + s, 'asdf'));
    jum.assertEquals('uiop', g(u + s, 'zxcv'));
    jum.assertEquals('qwer', g(s, 'asdf'));
    jum.assertEquals('uiop', g(s, 'zxcv'));
  };
  this.test_setQSParam = function () {
    var s = fleegix.url.setQSParam;
    var g = fleegix.url.getQSParam;
    var orig = 'http://foo.bar/?asdf=qwer&zxcv=uiop';
    var n;
    n = s(orig, 'asdf', 'QWER');
    jum.assertEquals('QWER', g(n, 'asdf'));
    n = s(orig, 'zxcv', 'UIOP');
    jum.assertEquals('UIOP', g(n, 'zxcv'));
  };
  this.test_removeQSParam = function () {
    var r = fleegix.url.removeQSParam;
    var base = 'http://foo.bar/';
    var qs = 'asdf=qwer&zxcv=uiop'
    var n;
    url = base + '?' + qs
    n = r(url, 'asdf');
    jum.assertEquals(base + '?zxcv=uiop', n);
    n = r(url, 'zxcv');
    jum.assertEquals(base + '?asdf=qwer', n);
    url = base + ';' + qs
    n = r(url, 'asdf');
    jum.assertEquals(base + ';zxcv=uiop', n);
    n = r(url, 'zxcv');
    jum.assertEquals(base + ';asdf=qwer', n);
    n = r(qs, 'asdf');
    jum.assertEquals('zxcv=uiop', n);
    n = r(qs, 'zxcv');
    jum.assertEquals('asdf=qwer', n);
  };
  // Test backward compatibility shims
  this.test_uriGetQueryBackwardCompat = function () {
    var q = fleegix.uri.getQuery;
    var s = 'asdf=qwer&zxcv=uiop';
    var u = 'http://foo.bar/';
    jum.assertEquals(s, q(u + '?' + s));
    jum.assertEquals(s, q(u + ';' + s));
    jum.assertEquals(s, q('?' + s));
    jum.assertEquals(s, q(';' + s));

  }
  this.test_uriGetParamBackwardCompat = function () {
    var g = fleegix.uri.getParam;
    var s = 'asdf=qwer&zxcv=uiop';
    var u = 'http://foo.bar/?';
    // Params are reversed, and passed-in QS is
    // optional -- defaults to local HREF for the
    // page it's defined on
    jum.assertEquals('qwer', g('asdf', u + s));
    jum.assertEquals('uiop', g('zxcv', u + s));
    jum.assertEquals('qwer', g('asdf', s));
    jum.assertEquals('uiop', g('zxcv', s));
  };
  this.test_uriSetParamBackwardCompat = function () {
    var s = fleegix.uri.setParam;
    var g = fleegix.url.getQSParam;
    var orig = 'http://foo.bar/?asdf=qwer&zxcv=uiop';
    var n;
    // Params are reversed, and passed-in QS is
    // optional -- defaults to local HREF for the
    // page it's defined on
    n = s('asdf', 'QWER', orig);
    jum.assertEquals('QWER', g(n, 'asdf'));
    n = s('zxcv', 'UIOP', orig);
    jum.assertEquals('UIOP', g(n, 'zxcv'));
  };

};



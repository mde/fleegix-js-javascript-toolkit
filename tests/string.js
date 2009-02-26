
fleegixMain.test_fleegixString = new function () {
  this.test_escapeXML = function () {
    var str, res, exp;
    // Test each char
    str = '\'"&<>';
    res = fleegix.string.escapeXML(str);
    exp = '&#39;&quot;&amp;&lt;&gt;';
    jum.assertEquals(exp, res);
  };
  this.test_escapeXMLGlobal = function () {
    var str, res, exp;
    // Test for global replace
    str = '\'\'""&&<<>>';
    res = fleegix.string.escapeXML(str);
    exp = '&#39;&#39;&quot;&quot;&amp;&amp;&lt;&lt;&gt;&gt;';
    jum.assertEquals(exp, res);
  };
  this.test_unescapeXML = function () {
    var str, res, exp;
    // Test each char
    str = '&#39;&quot;&amp;&lt;&gt;';
    res = fleegix.string.unescapeXML(str);
    exp = '\'"&<>';
    jum.assertEquals(exp, res);
  };
  this.test_unescapeXMLGlobal = function () {
    var str, res, exp;
    // Test for global replace
    str = '&#39;&#39;&quot;&quot;&amp;&amp;&lt;&lt;&gt;&gt;';
    res = fleegix.string.unescapeXML(str);
    exp = '\'\'""&&<<>>';
    jum.assertEquals(exp, res);
  };
  this.test_fuglyStringRoundTrip = function () {
    var res, exp;
    var fugly = '555_characters_abcdefg hijklmnopqrstuvwxyz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&*()-=+[]{};\':",.<>/?|_cha racters_abcdefghi jklmnopqrstuvwxyz1234567890ABCDEF GHIJKLMNOP QRSTUVWXYZabcdefg hijklmnopqrstuvwx yz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&*()-=+[]{}tuvwxyz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&*()-=+[]{};\':",.<>/?|_cha racters_abcdefghi vwxyz1234567890ABCDEF GHIJKLMNOP QRSTUVWX∆∂ø∑´Z!@#$%^&*()-=+[]{};\':",.<>/?abcdefg hijklmnopqrstuvwxyz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&*()-=+[]{}|Thisisthefinal45charactersinthistexttests_END';
    var fuglyEsc = '555_characters_abcdefg hijklmnopqrstuvwxyz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&amp;*()-=+[]{};&#39;:&quot;,.&lt;&gt;/?|_cha racters_abcdefghi jklmnopqrstuvwxyz1234567890ABCDEF GHIJKLMNOP QRSTUVWXYZabcdefg hijklmnopqrstuvwx yz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&amp;*()-=+[]{}tuvwxyz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&amp;*()-=+[]{};&#39;:&quot;,.&lt;&gt;/?|_cha racters_abcdefghi vwxyz1234567890ABCDEF GHIJKLMNOP QRSTUVWX∆∂ø∑´Z!@#$%^&amp;*()-=+[]{};&#39;:&quot;,.&lt;&gt;/?abcdefg hijklmnopqrstuvwxyz1234567890GHIJKL MNOPQR¢£§£STUVWXYZ!@ #$%^&amp;*()-=+[]{}|Thisisthefinal45charactersinthistexttests_END';
    res = fleegix.string.escapeXML(fugly);
    exp = fuglyEsc;
    jum.assertEquals(exp, res);
    res = fleegix.string.unescapeXML(fuglyEsc);
    exp = fugly;
    jum.assertEquals(exp, res);
  };
};


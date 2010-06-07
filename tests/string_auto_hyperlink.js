
fleegixMain.test_fleegixStringAutoHyperlink = new function () {
  this.test_linkUrl = function () {
    // Manually insert pipe chars where the open and close
    // anchor tags should go
    // NOTE: this only lets you test one URL per string
    arr = [
      '|http://foo.com/|',
      '|www.foo.com/|',
      '|www.foo.com|',
      '(|www.mysite.com|)',
      'Site: |http://www.mysite.com/asdf/foo/asdf|.',
      '|www.mysite.com/?foo=www.othersite.com|',
      '|www.mysite.com?foo=www.othersite.com|',
      'Is this my other site at |www.mysite.com|?',
      'foo=|www.othersite.com|',
      'foo |www.mysite.com;asfd=qwer| bar',
      '|http://www.mysite.com;asfd=qwer|',
      '|http://asdf.com:3000|',
      'Is the site |http://asdf.com:3000|?',
    ];
    var item;
    var text;
    var result;
    for (var i = 0; i < arr.length; i++) {
      // Split into an array:
      // item[0]: Before URL, if any
      // item[1]: URL
      // item[2]: After URL, if any
      item = arr[i].split('|');
      // Test text -- pipe chars stripped out
      text = item.join('');
      // Build the expected result -- insert the
      // open/close anchor tags before/after the URL
      result = item[0];
      result += '<a href="';
      // If the URL is www-only, prepend the http://
      result += item[1].indexOf('www') == 0 ?
        'http://' + item[1] : item[1];
      result += '">'
      result += item[1];
      result += '</a>';
      result += item[2];
      // Do the assert for each item
      jum.assertEquals(result,
        fleegix.string.autoHyperlink.url(text));
    }
  };
  this.test_linkEMail = function () {
    // Manually insert pipe chars where the open and close
    // anchor tags should go
    // NOTE: this only lets you test one URL per string
    arr = [
      'My addy is |foo@bar.com|.',
      'Is your e-mail address |foo@mail.baz.com|?',
      '(|foo@mail.baz.co.jp|)',
      '(|abc123@mail.baz.co.jp|)',
      'foo |foo.bar.baz@asdf.com| bar'
    ];
    var item;
    var text;
    var result;
    for (var i = 0; i < arr.length; i++) {
      // Split into an array:
      // item[0]: Before URL, if any
      // item[1]: URL
      // item[2]: After URL, if any
      item = arr[i].split('|');
      // Test text -- pipe chars stripped out
      text = item.join('');
      // Build the expected result -- insert the
      // open/close anchor tags before/after the URL
      result = item[0];
      result += '<a href="mailto:' + item[1] + '">';
      result += item[1];
      result += '</a>';
      result += item[2];
      // Do the assert for each item
      jum.assertEquals(result,
        fleegix.string.autoHyperlink.email(text));
    }
  };
};



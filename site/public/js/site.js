// Nobody likes RSI
var $ = function (s) { 
  return document.getElementById(s) };

var fleegix_site = new function () {
  
  this.errDisplayed = false;
  this.errDismissable = false;
  
  this.init = function () {
    var q = fleegix.uri.getQuery();;
    fleegix.fx.fadeIn($('web2Badge'));
    // Upgrade to XHR on contact page
    if (q == 'contact') {
      var sub = $('contactSubmit');
      $('contactForm').onsubmit = function () { return false; };
      sub.onclick = function () { return false; };
      // Make button act purty
      buttonBehave(sub);
      // Validate and submit form via XHR
      fleegix.event.listen(sub, 'onclick', validateSubmitContact);
      if (document.all) {
        $('contactError').style.filter = 'alpha(opacity=0);';
      }
    }
  };
  this.showErr = function () {
    if (this.errDisplayed) { return false; }
    // Deal with the retarded children
    if ((document.all && navigator.appVersion.indexOf('MSIE 6') > -1) ||
      (navigator.userAgent.indexOf('Safari/41') > -1)) {
      alert('All fields are required.');
    }
    else {
      var f = function () {
        fleegix_site.errDismissable = true;
      }
      err = $('contactError');
      var parent = err.parentNode;
      if (parent.id == 'contactForm') {
        err = parent.removeChild(err);
        document.body.appendChild(err);
      }
      err.style.top = '35%';
      err.style.left = '50%';
      err.style.display = 'block';
      var left = err.offsetLeft - (err.offsetWidth/2);
      err.style.left = left + 'px';
      err.style.visibility = 'visible';
      fleegix.fx.fadeIn(err);
      this.errDisplayed = true;
      setTimeout(f, 3000);
    }
  }
  this.hideErr = function () {
    if (!(this.errDisplayed && this.errDismissable)) { return false; }
    var f = function () {
        var e = $('contactError');
        e.style.visibility = 'hidden';
        e.style.display = 'false';
        fleegix_site.errDisplayed = false;
        fleegix_site.errDismissable = false;
    }
    fleegix.fx.fadeOut($('contactError'), { doAfterFinished: f });
  };
  
  function buttonBehave(btn) {
    var f = null;
    f = function (e) { morphButton(e, 'over') };
    fleegix.event.listen(btn, 'onmouseover', f);
    f = function (e) { morphButton(e, 'out') };
    fleegix.event.listen(btn, 'onmouseout', f);
    f = function (e) { morphButton(e, 'down') };
    fleegix.event.listen(btn, 'onmousedown', f);
    f = function (e) { morphButton(e, 'up') };
    fleegix.event.listen(btn, 'onmouseup', f);
  }
  function morphButton(e, s) {
    if (!e.target) { return false; }
    var id = e.target.id;
    var states = {
        over: 'btnElemBase btnElemMouseover',
        out: 'btnElemBase',
        down: 'btnElemBase btnElemMousedown',
        up: 'btnElemBase' 
    }
    $(id).className = states[s]; 
  }
  function validateSubmitContact() {
    var form = $('contactForm');
    var elem = ['full_name', 'email', 'subject', 'body'];
    var err = false;
    for (var i = 0; i < elem.length; i++) {
      if (!form.elements[elem[i]].value) {
        err = true;
        break;
      }
    }
    if (err) {
      fleegix_site.showErr();
    }
    else {
      var n = document.createElement('input');
      n.type = 'hidden';
      n.name = 'from_xhr';
      n.id = 'from_xhr';
      n.value = 'true';
      form.appendChild(n);
      var s = fleegix.form.serialize(form);
      fleegix.xhr.doPost(handleSubmit, '/contact_send.rbx', s);
    }
  }
  function handleSubmit(s) {
    var bod = $('contentBody');
    var h = bod.offsetHeight;
    bod.style.height = h + 'px';
    thanks = $('contactThanksDisplay');
    $('contactFormDisplay').style.display = 'none';
    if (document.all) {
      thanks.style.filter = 'alpha(opacity=0);';
    }
    thanks.style.display = 'block';
    fleegix.fx.fadeIn(thanks);
  }
}

fleegix.event.listen(window, 'onload', fleegix_site, 'init');
fleegix.event.listen(document, 'onmousemove', fleegix_site, 'hideErr');
fleegix.event.listen(document, 'onclick', fleegix_site, 'hideErr');
fleegix.event.listen(document, 'onkeypress', fleegix_site, 'hideErr');


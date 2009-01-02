fleegixMain.shared.test_navMain = new function () {
  this.test_navigate = {
    method: "open",
    params: { url: '/fleegix_js/tests/' }
  };
  this.test_hasNavigated = {
    method: "waits.forElement",
    params: { id: "mainPageHeader" }
  };
};


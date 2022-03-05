'use strict';

(function() {
  if (!window.browser && window.chrome) {
    window.browser = window.chrome;
  }

  const cppDlUrl = browser.runtime.getURL('src/cpp-dl.js');
  const script = document.createElement('script');
  script.setAttribute('src', cppDlUrl);
  document.body.append(script);
})();

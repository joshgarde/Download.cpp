'use strict';

(function() {
  if (!browser && chrome) {
    window.browser = chrome;
  }

  const cppDlUrl = browser.runtime.getURL('src/cpp-dl.js');
  const script = document.createElement('script');
  script.setAttribute('src', cppDlUrl);
  document.body.append(script);
})();

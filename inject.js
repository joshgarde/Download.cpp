'use strict';

if (!browser && chrome)
  var browser = chrome;

let cppDlUrl = browser.runtime.getURL('cpp-dl.js');

let script = document.createElement('script');
script.setAttribute('src', cppDlUrl);
document.body.append(script);

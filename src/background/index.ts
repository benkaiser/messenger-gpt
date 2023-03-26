console.info('chrome-ext template-preact-ts background script')

export {}

chrome.runtime.onInstalled.addListener(function() {
  chrome.runtime.openOptionsPage();
});
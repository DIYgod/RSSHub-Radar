export { }
console.log("HELLO WORLD FROM BGSCRIPTS")

chrome.offscreen.createDocument({
  url: chrome.runtime.getURL("tabs/offscreen.html"),
  reasons: [chrome.offscreen.Reason.IFRAME_SCRIPTING],
  justification: 'Get RSS in the sandbox for enhanced security.',
});

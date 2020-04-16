const injectScript = name => `
var script = document.createElement('script');
script.id = 'upext';
script.src = 'chrome-extension://${chrome.runtime.id}/js/${name}.js';
document.body.appendChild(script);
`;

const appendExtId = `
var script = document.createElement('script');
script.textContent = "var __extensionId = " + JSON.stringify(chrome.runtime.id);
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
`;

export function injectExtensionId(tabId) {
  chrome.tabs.executeScript(tabId, {
    code: appendExtId
  });
}

export function injectContentScriptFile(tabId, filename) {
  chrome.tabs.executeScript(tabId, {
    code: injectScript(filename)
  });
}

export function execContentScript(tabId, script) {
  chrome.tabs.executeScript(tabId, {
    code: script
  });
}

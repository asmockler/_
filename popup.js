const STORAGE_KEY = "_::blocked_sites";
const button = document.getElementById("toggle-block-website");

let blockedSites = new Set();
chrome.storage.sync.get(STORAGE_KEY, (result) => {
  blockedSites = new Set(result[STORAGE_KEY]);

  updateUI();
});

button.addEventListener("click", () => {
  getCurrentHostname().then((hostname) => {
    if (blockedSites.has(hostname)) {
      blockedSites.delete(hostname);
    } else {
      blockedSites.add(hostname);
    }

    chrome.storage.sync.set({
      [STORAGE_KEY]: [...blockedSites],
    });

    updateUI();

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "_::status_changed", blocked: blockedSites.has(hostname) },
        () => {}
      );
    });
  });
});

function updateUI() {
  getCurrentHostname().then((hostname) => {
    if (blockedSites.has(hostname)) {
      button.className = "btn unblock-site";
      button.innerText = "Unblock this website";
    } else {
      button.className = "btn block-site";
      button.innerText = "Block this website";
    }
  });
}

function getCurrentHostname() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.getSelected(({ url }) => {
        const { hostname } = new URL(url);
        resolve(hostname);
      });
    } catch (err) {
      reject("Failed to get hostname", err);
    }
  });
}

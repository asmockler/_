const STORAGE_KEY = "_::blocked_sites";
const site = window.location.host;

chrome.storage.sync.get([STORAGE_KEY], function (result) {
  const shouldBlockSite = result[STORAGE_KEY].includes(site);

  console.log(
    `%c_: %c${site} ${shouldBlockSite ? 'is blocked': 'is not blocked'}`,
    "font-weight: bold; color: salmon;",
    "font-weight: normal; color: white;"
  );

  if (shouldBlockSite) {
    document.body.style.display = 'none';
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "_::status_changed") {
      const blocked = request.blocked;

      if (blocked) {
        document.body.style.display = 'none';
      } else {
        document.body.style.display = 'block';
      }
    }

    sendResponse();
  }
);

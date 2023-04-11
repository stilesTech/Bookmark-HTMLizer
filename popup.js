document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.create({ url: "bookmarks.html", active: true });

    var ws = document.getElementById('ws');

    ws.addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL("bookmarks.html") });
    });
});
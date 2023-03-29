chrome.storage.sync.get(['pages'], function(result) {
    var pages = result.pages || {};
    var tags = pages[window.location.href];
    if (tags) {
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (tags.indexOf(link.innerText) !== -1) {
                link.style.backgroundColor = 'yellow';
            }
        }
    }
});
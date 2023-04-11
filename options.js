// Saves options to chrome.storage
function save_options() {
    var modeType = document.querySelector('input[name="mode"]:checked').value;
    if (modeType == 0) {
        chrome.action.setPopup({ popup: "bookmarks.html" });
    } else {
        chrome.action.setPopup({ popup: "popup.html" });
    }

    chrome.storage.local.set({
        modeType: modeType,
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved. / 设置已保存';
        setTimeout(function() {
            status.textContent = '';
        }, 5000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.local.get({
        modeType: '0',
    }, function(items) {
        document.getElementById('mode-' + items.modeType).checked = true;
    });
}

function reset_options() {
    chrome.storage.local.clear();
    restore_options();
}

document.addEventListener('DOMContentLoaded', function() {

    restore_options();

    var shortcuts = document.getElementById('setShortcuts');

    shortcuts.addEventListener('click', function() {
        openShortcuts();
    });
});

var inputs = document.getElementsByTagName('input');
for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    input.addEventListener('change', save_options);
}

// document.getElementById("btnReset").addEventListener('click', reset_options);

function openShortcuts() {
    chrome.tabs.create({
        url: 'chrome://extensions/shortcuts'
    });
}
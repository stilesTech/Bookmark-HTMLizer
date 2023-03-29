chrome.runtime.onInstalled.addListener(function()  {
    chrome.commands.onCommand.addListener(function(command){
        if (command === "activate_extension") {
            // 在这里编写您的代码，当用户按下快捷键时激活您的扩展程序
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.browserAction.getPopup({ tabId: tabs[0].id }, function (popupUrl) {
                    //新标签页打开
                    chrome.tabs.create({url: "bookmarks.html",  active: true});
                });
            });
        }
    });


    //加载标签图标
   
});

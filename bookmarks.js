// 获取搜索框和书签div元素
var searchInput = document.getElementById("search");

// 获取所有书签及其文件夹信息
chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    // 获取所有标签
    var bookmarks = bookmarkTreeNodes[0];

    console.log(bookmarks);

    var bookmarksContents = document.getElementById('bookmarks-contents');
    bookmarks.title = "";

    bookmarksContents.innerHTML = createBookmarkTree(bookmarks, "");
    addSmartIdToParts();

    var bookmarksMark = document.getElementById('bookmarks-mark');
    bookmarksMark.innerHTML = createBookmarkMarks();

    // 全局设置img onerror事件
    allImgsSetOnErrorEvent();
    //添加滚动事件
    addScrollEventListener();

    // 添加搜索输入框的监听器，根据输入过滤书签
    var searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("click", function() {
        searchReload();
    });

    // 监控回车事件
    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // 回车键按下，执行相应的操作
            searchReload();
        }
    });

    addRemoveBookmarkListener();
});

function searchReload() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        // 获取所有标签
        var searchInput = document.getElementById("searchInput");
        var keyword = searchInput.value.toLowerCase();

        var filteredBookmarks = filterBookmarkTreeNodes(bookmarkTreeNodes, keyword);
        if (filteredBookmarks.length == 0) {
            reloadEmptyHtml();
            return;
        }

        var bookmarksContents = document.getElementById('bookmarks-contents');
        bookmarksContents.innerHTML = createBookmarkTree(filteredBookmarks[0], "");
        addSmartIdToParts();
        var bookmarksMark = document.getElementById('bookmarks-mark');
        bookmarksMark.innerHTML = createBookmarkMarks();
        // 全局设置img onerror事件
        allImgsSetOnErrorEvent();

        addScrollEventListener();
    });
}

function reloadEmptyHtml() {
    var filteredBookmarks = [];
    filteredBookmarks.push({
        id: 0,
        title: "没有匹配的书签",
        children: [],
    });
    var bookmarksContents = document.getElementById('bookmarks-contents');
    bookmarksContents.innerHTML = createBookmarkTree(filteredBookmarks[0], "");
    var bookmarksMark = document.getElementById('bookmarks-mark');
    bookmarksMark.innerHTML = "";
    return;
}

function filterBookmarkTreeNodes(bookmarkTreeNodes, keyword) {
    const filteredNodes = [];
    for (const node of bookmarkTreeNodes) {
        if (node.children) {
            const filteredChildren = filterBookmarkTreeNodes(node.children, keyword);
            if (filteredChildren.length > 0) {
                filteredNodes.push({
                    id: node.id,
                    title: node.title,
                    children: filteredChildren,
                });
            }
        } else {
            if (node.title.toLowerCase().includes(keyword.toLowerCase()) ||
                node.url.toLowerCase().includes(keyword.toLowerCase())) {
                filteredNodes.push({
                    id: node.id,
                    title: node.title,
                    url: node.url,
                });
            }
        }
    }
    return filteredNodes;
}

function addSmartIdToParts() {
    const parts = document.querySelectorAll('.part');
    for (let i = 0; i < parts.length; i++) {
        parts[i].setAttribute('id', 'smart' + (i + 1));
    }
}

function addScrollEventListener() {
    window.addEventListener('scroll', function() {
        const parts = document.querySelectorAll('.part');
        for (let i = 0; i < parts.length; i++) {
            const rect = parts[i].getBoundingClientRect();
            const affectedElement = document.getElementById('smart-link-' + (i + 1));

            //添加新的current元素
            if (rect.top <= 0) {
                //移除之前元素的current属性
                const items = document.querySelectorAll(".smart-link");
                for (var index = 0; index < items.length; index++) {
                    if (items[index].classList.contains("current") && items[index].getAttribute("id") != affectedElement) {
                        items[index].classList.remove("current");
                    }
                }

                affectedElement.classList.add('current');
            } else if (affectedElement) {
                affectedElement.classList.remove('current');
            }
        }
    });
}

function allImgsSetOnErrorEvent() {
    // 获取所有的 img 元素
    const imgs = document.querySelectorAll('img');

    // 为所有的 img 元素添加 onerror 事件
    imgs.forEach(img => {
        img.onerror = () => {
            img.src = 'images/fallback-image.png';
        };
    });
}

function createBookmarkTree(bookmarks, parentName) {
    if (!bookmarks || !bookmarks.children) {
        return;
    }

    let html = `<div class="part" ><h2 data-parent="${parentName}"><strong>${bookmarks.title}</strong></h2><div class="items"><div class="row">`;
    var nodeHtmls = "";
    let hasHtml = false;
    for (var i = 0; i < bookmarks.children.length; i++) {
        if (bookmarks.children[i].url) {
            html += `<div class="col-xs-6 col-sm-4 col-md-2"><div class="item"><div class="close-button" data-id="${bookmarks.children[i].id}"></div><a href="${bookmarks.children[i].url}" target="_blank"><img src="${getFaviconIcon(bookmarks.children[i])}" alt="${getTitle(bookmarks.children[i].title)}">
            <h3>${getTitle(bookmarks.children[i].title)}</h3>
            <p>${bookmarks.children[i].title}</p>            
            </a></div></div>`;
            hasHtml=true;
        } else {
            nodeHtmls += createBookmarkTree(bookmarks.children[i], bookmarks.title);
        }
    }
    html += `</div></div></div>`;

    // 过滤元素为空的html
    if (!hasHtml) {
        html = "";
    }
    return html + nodeHtmls;
}

function createBookmarkMarks() {
    var html = "";
    const headings = document.querySelectorAll('#bookmarks-contents h2');
    for (let i = 0; i < headings.length; i++) {
        const text = headings[i].textContent;
        // const parentName = headings[i].getAttribute("data-parent");
        html += `<dd id="smart-link-${i + 1}" class="smart-link ${i == 0 ? 'current' : ''}"><span class="show-list"></span><a href="#smart${i + 1}" class="auto-scroll" data-offset="-20" data-speed="500">${text}</a></dd>`;
    }
    return html;
}

function getFaviconIcon(bookmark) {
    // if (bookmark && bookmark.url) {
    //     const url = new URL(bookmark.url)
    //     return url.origin + "/favicon.ico";
    // }
    // return "";
   
    return "chrome://favicon/size/64@1x/" + bookmark.url;
}


function fetchFavicon(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.src = 'chrome://favicon/' + url;
    });
}

function getTitle(title) {
    var result = title.split(/[-_]/)[0];

    if (result.length < 50) {
        return result;
    }
    return result.substr(0, 50) + "...";
}

function addRemoveBookmarkListener() {
    // 获取所有的 关闭按钮 元素
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener("click", function() {
            var bookmarkId = this.getAttribute("data-id");
            console.log("bookmarkId", bookmarkId);
            chrome.bookmarks.remove(bookmarkId, function() {
                searchReload(); // 删除成功后刷新列表
            });
        });
    });

}
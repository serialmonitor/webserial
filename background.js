chrome.runtime.onInstalled.addListener(() => {
    console.log("串口监视器插件已安装");
});

// 添加点击图标时创建新窗口的监听器
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        // chrome.windows.create({
        url: "src/index.html"
        // ,type: "popup"
    });
});


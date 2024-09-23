window.onload = () => {
    openpage();
    function openpage() {
        chrome.windows.getCurrent((currentWindow) => {
            chrome.windows.update(currentWindow.id, { focused: true });
            chrome.tabs.create({
                url: "src/index.html"
            }, (createdTab) => {
                chrome.tabs.update(createdTab.id, { active: true });
            });
        });
    }
}

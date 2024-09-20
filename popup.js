window.onload = () => {
    openpage();
    function openpage() {
        chrome.windows.getCurrent((currentWindow) => {
            chrome.windows.update(currentWindow.id, { focused: true });
            chrome.windows.create({
                url: "src/index.html"
                // ,
                // type: "popup"
            }, (createdWindow) => {
                chrome.windows.update(createdWindow.id, { focused: true });
            });
        });
    }
}
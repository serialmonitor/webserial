const connectButton = document.getElementById('connectButton');

connectButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "connect" }, (response) => {
        if (response.success) {
            console.log("连接成功");
        } else {
            console.error("连接失败:", response.error);
        }
    });
});
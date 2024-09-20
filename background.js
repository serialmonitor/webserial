chrome.runtime.onInstalled.addListener(() => {
    console.log("串口监视器插件已安装");
});

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "connect") {
        // 处理连接逻辑
        connectToSerialPort().then(sendResponse);
        return true; // 表示异步响应
    } else if (request.action === "disconnect") {
        // 处理断开连接逻辑
        disconnectFromSerialPort().then(sendResponse);
        return true; // 表示异步响应
    }
});

// 连接串口的函数
let port; // 保存连接的 port 对象

async function connectToSerialPort() {
    try {
        port = await navigator.serial.requestPort();
        const options = {
            baudRate: parseInt(document.getElementById('baudRate').value),
            dataBits: parseInt(document.getElementById('dataBits').value),
            parity: document.getElementById('parity').value,
            stopBits: parseInt(document.getElementById('stopBits').value),
            rts: document.getElementById('rts').checked,
            dtr: document.getElementById('dtr').checked
        };
        await port.open(options);
        console.log("已连接到串口");
        return { success: true };
    } catch (error) {
        console.error("连接失败:", error);
        return { success: false, error: error.message };
    }
}

// 断开连接的函数
async function disconnectFromSerialPort() {
    if (port) {
        await port.close();
        console.log("已断开连接");
    }
}
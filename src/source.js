if ('serial' in navigator) {
    const notSupported = document.getElementById('notSupported');
    notSupported.classList.add('hidden');
} else {
    const notSupported = document.getElementById('notSupported');
    notSupported.textContent = "Sorry, Web Serial is not supported on this device.";
    notSupported.style.display = 'block'; // 显示不支持消息
}

const log = document.getElementById("log");

// 添加事件监听器
window.onload = function () {
    document.getElementById('connect').addEventListener('click', connect);
    document.getElementById('sendButton').addEventListener('click', send);
    document.getElementById('input').addEventListener('keypress', handle);
    document.getElementById('settingsButton').addEventListener('click', toggleSettingsMenu);

    // 初始化设置菜单的值
    document.getElementById('baudRate').value = "115200";
    document.getElementById('lineEnding').value = "\r\n";
    document.getElementById('showInput').checked = true;
    document.getElementById('showTimestamps').checked = true;
    document.getElementById('detectCtrl').checked = true;
};

function send() {
    const toSend = document.getElementById("input").value;
    writeToStream(toSend);
    document.getElementById("input").value = "";
}

function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        send();
    }
}

async function connect() {
    const inputField = document.getElementById("input");
    inputField.disabled = false; // 启用输入框
    inputField.focus();
    inputField.select();
    document.getElementById("sendButton").disabled = false;
    document.getElementById("connect").disabled = true;

    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        console.log('Open');

        let decoder = new TextDecoderStream();
        inputDone = port.readable.pipeTo(decoder.writable);
        inputStream = decoder.readable;

        const encoder = new TextEncoderStream();
        outputDone = encoder.readable.pipeTo(port.writable);
        outputStream = encoder.writable;

        reader = inputStream.getReader();
        readLoop();

        // 隐藏错误消息
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = 'none'; // 隐藏错误消息
    } catch (error) {
        console.error('Connection failed:', error);
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Connection failed: " + error.message + "\nLooks like something went wrong 😢\nWe recommend using the latest version of Chrome for desktop.";
        errorMessage.style.display = 'block'; // 显示错误消息
        document.getElementById("connect").disabled = false; // 重新启用连接按钮
    }
}

function writeToStream(line) {
    const writer = outputStream.getWriter();
    console.log('[SEND]', line);
    writer.write(line + '\r');
    writer.releaseLock();
}

async function readLoop() {
    console.log('Readloop');

    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            log.textContent += value;
            log.scrollTop = log.scrollHeight;
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
}

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.classList.toggle('hidden');
    // 确保在显示时使用 flex
    settingsMenu.style.display = settingsMenu.classList.contains('hidden') ? 'none' : 'flex';
}
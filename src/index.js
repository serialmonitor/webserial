const outputElement = document.getElementById('output');
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');

window.onload = () => {

    connectButton.addEventListener('click', async () => {
        try {
            port = await navigator.serial.requestPort(); // 确保调用此方法
            const options = {
                baudRate: parseInt(baudRateSelect.value),
                dataBits: parseInt(dataBitsSelect.value),
                parity: paritySelect.value,
                stopBits: parseInt(stopBitsSelect.value),
                rts: rtsCheckbox.checked,
                dtr: dtrCheckbox.checked
            };
            await port.open(options);
            outputElement.textContent += "连接成功\n";
            disconnectButton.disabled = false;
            connectButton.disabled = true;
            readFromPort();
        } catch (error) {
            outputElement.textContent += `连接失败: ${error}\n`;
        }
    });

    disconnectButton.addEventListener('click', async () => {
        if (reader) {
            await reader.cancel();
        }
        await port.close();
        outputElement.textContent += "已断开连接\n";
        disconnectButton.disabled = true;
        connectButton.disabled = false;
    });
}
const vscode = require('vscode');

function prompt(message, defaultVal) {
    return new Promise((resolve, reject) => {
        return vscode.window.showInputBox({
            value: defaultVal,
            prompt: message
        }).then(resolve);
    });
}

module.exports = {
    async connectOrDisconect(port) {
		let ret = false, isOpen = port.isOpen;
		if (isOpen) ret = await port.close();
		else ret = await port.open();

		if(ret) vscode.window.showInformationMessage(`${port.path} was ${!isOpen ? 'Connected' : 'Disconnected'}.`);
		else vscode.window.showErrorMessage(`${port.path} ${!isOpen ? 'Connect' : 'Disconnect'} was failed. Error Message: ${port.lasterror}`);
    },

	async sendEntry(port) {
		let data = await prompt(`Send String to ${port.path}`);
		let ret = await port.port.send(data);
		if(ret) vscode.window.showInformationMessage(`Send Data to ${port.path} was Success.`);
		else vscode.window.showErrorMessage(`Send Data to ${port.path} was failed. Error Message: ${port.lasterror}`);
	}
}
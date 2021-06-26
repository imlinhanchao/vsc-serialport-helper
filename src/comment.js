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

		if (ret) vscode.window.showInformationMessage(`${port.path} was ${!isOpen ? 'Connected' : 'Disconnected'}.`);
		else vscode.window.showErrorMessage(`${port.path} ${!isOpen ? 'Connect' : 'Disconnect'} was failed. Error Message: ${port.lasterror}`);
    },

	async updateEntry(port, attr) {
		let data = port.options[attr];
		data = await prompt(`Set ${port.path} option ${attr}`, data);
		if (!data) return;
		data = attr != 'parity' ? parseInt(data) : data;
		let ret = true;
		await port.setting({ [attr]: data });
		if (ret) {
			port.options[attr] = data;
			vscode.window.showInformationMessage(`Update ${attr} of ${port.path} was Success.`);
		} else vscode.window.showErrorMessage(`Update ${attr} of ${port.path} was failed. Error Message: ${port.lasterror}`);
	},

	async sendEntry(port) {
		let data = await prompt(`Send String to ${port.path}`);
		if (!data) return;
		let ret = await port.port.send(data);
		if (ret) vscode.window.showInformationMessage(`Send Data to ${port.path} was Success.`);
		else vscode.window.showErrorMessage(`Send Data to ${port.path} was failed. Error Message: ${port.lasterror}`);
	}
}
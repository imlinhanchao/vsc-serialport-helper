const vscode = require('vscode');
const locale = require('../i18n')();

let attrOptions = {
	baudRate: [115200, 57600, 38400, 19200, 9600, 4800, 2400, 1800, 1200, 600, 300, 200, 150, 134, 110, 75, 50],
	dataBits: [8, 7, 6, 5],
	stopBits: [1, 2],
	parity: ['none', 'even', 'mark', 'odd', 'space']
};

module.exports = {
    async connectOrDisconect(port) {
		let ret = false, isOpen = port.isOpen;
		if (isOpen) ret = await port.close();
		else ret = await port.open();

		if (!ret) vscode.window.showErrorMessage(port.lasterror);
    },

	async updateEntry(port, attr) {
		let data = port.options[attr];
		data = await vscode.window.showQuickPick(attrOptions[attr].map(a => ({ label: a.toString() })), 
			{ title: locale['update_title'].replace(/{{path}}/, port.path).replace(/{{attr}}/, locale[attr]) });
		if (!data) return;
		data = attr != 'parity' ? parseInt(data.label) : data.label;
		let ret = true;
		await port.setting({ [attr]: data });
		if (ret) {
			port.options[attr] = data;
		} else vscode.window.showErrorMessage(`Update ${attr} of ${port.path} was failed. Error Message: ${port.lasterror}`);
	},

	async sendEntry(port) {
		let data = await vscode.window.showInputBox({ title: locale['send_title'].replace(/{{path}}/, port.path) });
		if (!data) return;
		let ret = await port.port.send(data + '\n');
		if (ret) vscode.window.showInformationMessage(locale['send_success'].replace(/{{path}}/, port.path));
		else vscode.window.showErrorMessage(`Send Data to ${port.path} was failed. Error Message: ${port.lasterror}`);
	}
}
const vscode = require('vscode');

module.exports = {
    connectOrDisconect(port) {
		let ret = false;
		if (port.isOpen) ret = port.close();
		else ret = port.open();

		// Display a message box to the user
		if(ret) vscode.window.showInformationMessage(`${port.path} was ${port.isOpen ? 'Connected' : 'Disconnected'}.`);
		else  vscode.window.showErrorMessage(`${port.path} ${!port.isOpen ? 'Connect' : 'Disconnect'} was failed. Error Message: ${port.lasterror}`);
    }
}
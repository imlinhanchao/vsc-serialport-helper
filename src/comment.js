const vscode = require('vscode');

module.exports = {
    connectOrDisconect(port) {
		let ret = false, isOpen = port.isOpen;
		if (isOpen) ret = port.close();
		else ret = port.open();

		// Display a message box to the user
		if(ret) vscode.window.showInformationMessage(`${port.path} was ${!isOpen ? 'Connected' : 'Disconnected'}.`);
		else vscode.window.showErrorMessage(`${port.path} ${!isOpen ? 'Connect' : 'Disconnect'} was failed. Error Message: ${port.lasterror}`);
    }
}
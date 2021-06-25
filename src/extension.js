// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { SerialPortProvider } = require('./SerialPort');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "serialport-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('serialport.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from SerialPort-Helper!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('serialport.connectOrDisconect', function (port) {
		// The code you place here will be executed every time your command is executed
		let ret = false;
		if (port.isOpen) ret = port.close();
		else ret = port.open();

		// Display a message box to the user
		if(ret) vscode.window.showInformationMessage(`${port.path} was ${port.isOpen ? 'Connected' : 'Disconnected'}.`);
		else  vscode.window.showErrorMessage(`${port.path} ${!port.isOpen ? 'Connect' : 'Disconnect'} was failed. Error Message: ${port.lasterror}`);
	}));

	const SerialPortsProvider = new SerialPortProvider();
	vscode.window.registerTreeDataProvider('serialport', SerialPortsProvider);


}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { SerialPortProvider } = require('./SerialPort');
const command = require('./comment');

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

	context.subscriptions.push(vscode.commands.registerCommand('serialport.connectOrDisconect', command.connectOrDisconect));
	context.subscriptions.push(vscode.commands.registerCommand('serialport.sendEntry', command.sendEntry));
	context.subscriptions.push(vscode.commands.registerCommand('serialport.updateEntry', command.updateEntry));

	const SerialPortsProvider = new SerialPortProvider();
	vscode.window.registerTreeDataProvider('serialport', SerialPortsProvider);
	vscode.commands.registerCommand('serialport.refreshEntry', () => SerialPortsProvider.refresh());


}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

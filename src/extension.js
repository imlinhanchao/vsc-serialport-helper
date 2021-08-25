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
	console.debug('Congratulations, your extension "serialport-helper" is now active!');

	command.init(context);

	context.subscriptions.push(vscode.commands.registerCommand('serialport.connectOrDisconect', command.connectOrDisconect));
	context.subscriptions.push(vscode.commands.registerCommand('serialport.sendEntry', command.sendEntry));
	context.subscriptions.push(vscode.commands.registerCommand('serialport.updateEntry', command.updateEntry));

	const SerialPortsProvider = new SerialPortProvider(context);
	vscode.window.registerTreeDataProvider('serialport', SerialPortsProvider);
	vscode.commands.registerCommand('serialport.refreshEntry', () => SerialPortsProvider.refresh());


}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

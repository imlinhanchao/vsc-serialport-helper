const vscode = require('vscode');
const SerialPort = require('../lib/serialport');
const path = require('path');


class SerialPortProvider {


	constructor() {
		this._onDidChangeTreeData = new vscode.EventEmitter();
	}

	get onDidChangeTreeData() {
		return this._onDidChangeTreeData.event
	}

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	getParent(element) {
		return null;
	}

	async getChildren(element) {
		if (!element) {
			return await this.getSerialPortList();
		} else {
			console.dir(element);
			return null;
		}

	}

	async getSerialPortList() {
		let port = await SerialPort.search();
		return port.map(p => new SerialPortItem(p.path, vscode.TreeItemCollapsibleState.Collapsed))
	}
}
class SerialPortItem extends vscode.TreeItem {

	constructor(
		label,
		collapsibleState,
		command
	) {
		super(label, collapsibleState);
        this.port = new SerialPort(label);
        this.contextValue = 'serialport-item';
        this.command= command;
	}

	get tooltip() {
		return `${this.label}(${this.port.open ? 'connected' : 'disconected'})`;
	}

	get description() {
		return this.version;
	}

	get iconPath() {
        return {
            light: path.join(__filename, '..', '..', 'resources', 'light', this.port.open ? 'link.svg' : 'unlink.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', this.port.open ? 'link.svg' : 'unlink.svg')
        };
    }
}

module.exports = { SerialPortItem, SerialPortProvider};
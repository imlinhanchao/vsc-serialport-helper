const vscode = require('vscode');
const SerialPort = require('../lib/serialport');
const path = require('path');


class SerialPortProvider {
	constructor() {
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.refreshPort();
	}

	get onDidChangeTreeData() {
		return this._onDidChangeTreeData.event
	}

	async refreshPort() {
		let port = await SerialPort.search();
		this.ports = port.map(p => new SerialPortItem(p, vscode.TreeItemCollapsibleState.None, () => {
			this._onDidChangeTreeData.fire();
		}))
	}

	refresh() {
		this.refreshPort();
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	async getChildren(element) {
		if (!element) {
			return await this.getSerialPortList();
		} else {
			console.dir(element);
			return [];
		}

	}

	async getSerialPortList() {
		return this.ports;
	}
}
class SerialPortItem extends vscode.TreeItem {
	constructor(
		port,
		collapsibleState,
		changeEvent
	) {
		super(port.path, collapsibleState);
        this.port = new SerialPort(port.path);
        this.contextValue = 'serialport-item';
        this.command= {
			command: 'serialport.connectOrDisconect',
			title: '',
			arguments: [this.port]
		};
		this.info = port;
		this.changeEvent = changeEvent;
		this.port.onChange(() => {
			this.changeEvent();
		})
	}

	get tooltip() {
		return `VID:  ${this.info.vendorId}
PID:  ${this.info.productId}
Manufacturer: ${this.info.manufacturer}
SerialNumber: ${this.info.serialNumber}`;
	}

	get description() {
		return `[${this.port.isOpen ? 'Connected' : 'Disconected'}]`;
	}

	get iconPath() {
        return path.join(__filename, '..', '..', 'resources', this.port.isOpen ? 'link.svg' : 'unlink.svg');
    }
}

module.exports = { SerialPortItem, SerialPortProvider};
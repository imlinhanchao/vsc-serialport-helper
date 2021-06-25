const vscode = require('vscode');
const SerialPort = require('../lib/serialport');
const path = require('path');


class SerialPortProvider {
	constructor() {
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.refreshPort();
		this.ports = [];
	}

	get onDidChangeTreeData() {
		return this._onDidChangeTreeData.event
	}

	async refreshPort() {
		let ports = await SerialPort.search();
		let paths = this.ports.map(p => p.path);
		let portNew = ports.filter(p => paths.indexOf(p.path) < 0);
		paths = ports.map(p => p.path);
		this.ports = this.ports.filter(p => paths.indexOf(p.path) >= 0);
		this.ports = this.ports.concat(portNew.map(p => new SerialPortItem(p, vscode.TreeItemCollapsibleState.None, () => {
			this._onDidChangeTreeData.fire();
		})))
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
			arguments: [this]
		};
		this.info = port;
		this.changeEvent = changeEvent;
		this.port.onChange((isOpen) => {
			this.changeEvent();
			if (isOpen) this.showChannel();
		});
		this.port.onListen((err, data) => {
			if(!err) this.outputData(data);
			else vscode.window.showErrorMessage(`Serial Port [${port.path}] get some error: ${err.message}`)
		});
	}

	outputData(data) {
		if (!this.port.isOpen) return;
		this.outputChannel.append(data.toString());
	}

	open() {
		this.outputChannel = vscode.window.createOutputChannel(`Serial Port [${this.path}]`);
		return this.port.open();
	}

	close() {
		this.outputChannel.clear();
		this.outputChannel.dispose();
		return this.port.close();
	}

	get isOpen() {
		return this.port.isOpen;
	}

	get path() {
		return this.info.path;
	}

	showChannel() {
		this.outputChannel.show(true);
	}

	get tooltip() {
		return `VID:  ${this.info.vendorId}
PID:  ${this.info.productId}
Manufacturer: ${this.info.manufacturer}
SerialNumber: ${this.info.serialNumber}
* Click to ${this.port.isOpen ? 'Disconnect' : 'Connect'}`;
	}

	get description() {
		return `[${this.port.isOpen ? 'Connected' : 'Disconnected'}]`;
	}

	get iconPath() {
        return path.join(__filename, '..', '..', 'resources', this.port.isOpen ? 'link.svg' : 'unlink.svg');
    }
}

module.exports = { SerialPortItem, SerialPortProvider};
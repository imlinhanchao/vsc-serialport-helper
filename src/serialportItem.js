const vscode = require('vscode');
const SerialPort = require('../lib/serialport');
const path = require('path');

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

module.exports = SerialPortItem;
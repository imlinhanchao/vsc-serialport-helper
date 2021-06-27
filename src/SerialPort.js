const vscode = require('vscode');
const SerialPort = require('../lib/serialport');
const path = require('path');
const locale = require('../i18n')();


class SerialPortProvider {
	constructor(context) {
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.refreshPort();
		this.ports = [];
		this.context = context;
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
		this.ports = this.ports.concat(portNew.map(p => new SerialPortItem(p, this.context,
			vscode.TreeItemCollapsibleState.Collapsed, () => {
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
			return ['baudRate', 'dataBits', 'stopBits', 'parity'].map(a => new SerialPortAttr(element, a, 
				vscode.TreeItemCollapsibleState.None, () => {
				this._onDidChangeTreeData.fire();
			}))
		}

	}

	async getSerialPortList() {
		return this.ports;
	}
}
class SerialPortItem extends vscode.TreeItem {
	constructor(
		port,
		context,
		collapsibleState,
		changeEvent
	) {
		super(port.path, collapsibleState);
        this.context = context;
        this.contextValue = 'serialport-item';
        this.command= {
			command: 'serialport.connectOrDisconect',
			title: '',
			arguments: [this]
		};
		this.info = port;
		this.changeEvent = changeEvent;
		this.initPort(port.path, this.context.globalState.get(`serialport.${port.path}`) || {
			baudRate: 9600,
			dataBits: 8,
			stopBits: 1,
			parity: 'none'
		});
	}

	initPort(path, options) {
		this.options = options;
		let isOpen = this.port && this.port.isOpen;
		if (isOpen) this.port.close();
		this.port = new SerialPort(path, this.options);
		this.port.onChange((isOpen) => {
			this.changeEvent();
			if (isOpen) this.showChannel();
		});
		this.port.onListen((err, data) => {
			if(!err) this.outputData(data);
			else vscode.window.showErrorMessage(`Serial Port [${path}] get some error: ${err.message}`)
		});
		if (isOpen) this.port.open();

		this.context.globalState.update(`serialport.${path}`, this.options);
	}

	outputData(data) {
		if (!this.port.isOpen) return;
		this.outputChannel.append(data.toString());
	}

	open() {
		this.outputChannel = vscode.window.createOutputChannel(`${locale['serialport']} [${this.path}]`);
		return this.port.open();
	}

	close() {
		this.outputChannel.clear();
		this.outputChannel.dispose();
		return this.port.close();
	}

	async setting(options) {
		this.initPort(this.port.path, Object.assign(this.options, options));
		this.changeEvent();
		return true;
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
${locale['manufacturer']}: ${this.info.manufacturer}
${locale['serialNumber']}: ${this.info.serialNumber}
* ${locale['click_to']} ${this.port.isOpen ? locale['disconnect'] : locale['connect']}`;
	}

	get description() {
		return `[${this.port.isOpen ? locale['connect'] : locale['disconnect']}]`;
	}

	get iconPath() {
        return path.join(__filename, '..', '..', 'resources', this.port.isOpen ? 'link.svg' : 'unlink.svg');
    }

	get lasterror() {
		return this.port.lasterror && this.port.lasterror.message;
	}
}

class SerialPortAttr extends vscode.TreeItem {
	constructor(
		port,
		attr,
		collapsibleState,
		changeEvent
	) {
		super(locale[attr], collapsibleState);
        this.contextValue = 'serialport-attr';
        this.command= {
			command: 'serialport.updateEntry',
			title: '',
			arguments: [port, attr]
		};
		this.attr = attr;
		this.port = port;
		this.changeEvent = changeEvent;
	}

	get tooltip() {
		return locale['click_update'];
	}

	get description() {
		return this.port.options[this.attr].toString();
	}

	get iconPath() {
        return {
			light: path.join(__filename, '..', '..', 'resources', 'light', 'setting.svg'),
			dark: path.join(__filename, '..', '..', 'resources', 'dark', 'setting.svg')
		};
    }
}

module.exports = { SerialPortItem, SerialPortProvider};
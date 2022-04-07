const locale = require('../i18n')();
const vscode = require('vscode');
let SerialPort
try {
    SerialPort = require('node-usb-native').SerialPort;
} catch (error) {
    vscode.window.showWarningMessage(locale['init_fail'])
}

class Module 
{
    constructor(path, options) {
        if (!SerialPort) return;
        this.connected = false;
        options = options || {}
        options.autoOpen = false;
        this.port = new SerialPort(path, options, (err) => {
            this.lasterror = err;
        });
        this.options = options;
        this.path = path;
    }

    onListen(callback) {
        this.port.on('error', (err) => {
            callback(err)
        })

        this.port.on('data', (data) => {
            callback(null, data)
        })
    }

    onChange(callback) {
        this.port.on('open', (data) => {
            callback(true, data)
        })
        this.port.on('close', (data) => {
            callback(false, data)
        })

    }

    open() {
        return new Promise((resolve) => {
            this.port.open((err) => {
                this.lasterror = err;
                resolve(!err);
            })
        })
    }

    close() {
        return new Promise((resolve) => {
            this.port.close((err) => {
                this.lasterror = err;
                resolve(!err);
            })
        })
    }

    send(data) {
        return new Promise((resolve) => {
            this.port.write(data, (err) => {
                this.lasterror = err;
                resolve(!err);
            })
        })
    }

    get isOpen() {
        return this.port.isOpen;
    }

    static search() {
        if (!SerialPort) {
            vscode.window.showWarningMessage(locale['init_fail']);
            return;
        }
        return SerialPort.list();
    }
}

module.exports = Module
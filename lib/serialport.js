const { SerialPort } = require('node-usb-native');

class Module 
{
    constructor(path, options) {
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
        this.port.on('error', function(err) {
            callback(err)
        })

        this.port.on('data', function (data) {
            callback(null, data)
        })
    }

    onChange(callback) {
        this.port.on('open', function (data) {
            callback(data)
        })
        this.port.on('close', function (data) {
            callback(data)
        })

    }

    open() {
        return new Promise((resolve) => {
            this.port.open((err) => {
                this.lasterror = err;
                resolve(!!err);
            })
        })
    }

    close() {
        return new Promise((resolve) => {
            this.port.close((err) => {
                this.lasterror = err;
                resolve(!!err);
            })
        })
    }

    send(data) {
        return new Promise((resolve) => {
            this.port.write(data, (err) => {
                this.lasterror = err;
                resolve(!!err);
            })
        })
    }

    get isOpen() {
        return this.port.isOpen;
    }

    static search() {
        return SerialPort.list();
    }
}

module.exports = Module
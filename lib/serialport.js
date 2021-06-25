const { SerialPort } = require('node-usb-native');

class Module 
{
    constructor(path, options) {
        this.connected = false;
        this.port = new SerialPort(path, options, (err) => {
            this.lasterror = err;
        });
    }

    listen(callback) {
        this.port.on('error', function(err) {
            callback(err)
        })

        this.port.on('data', function (data) {
            callback(null, data)
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

    send(data) {
        return new Promise((resolve) => {
            this.port.write(data, function(err) {
                this.lasterror = err;
                resolve(!!err);
            })
        })
    }

    get open() {
        return this.port.isOpen;
    }

    static search() {
        return SerialPort.list();
    }
}

module.exports = Module
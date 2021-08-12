// support to VSCode 1.59.0

const fs = require('fs');
const path = require('path');

async function main() {
    let nodes = fs.readdirSync(path.join(__dirname, 'node'));
    nodes.forEach(n => {
        let srcfile = path.join(__dirname, 'node', n);
        let destfile = path.join(__dirname, '../../node_modules/node-usb-native/lib/native', n);
        console.info(`copy file ${srcfile} to ${destfile}`);
        if(!fs.existsSync(destfile)) 
            fs.copyFileSync(srcfile, destfile, fs.constants.COPYFILE_EXCL)
    });
}

main();
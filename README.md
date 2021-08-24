# Serial Port Helper

You can connect any serial port used to read / write data.

## Features

1. Serial Port View;  
   ![](media/View.png)
2. Serial Port Config;  
   ![](media/Config.png)
3. TX / RX;  
   ![](media/TX.png)
   ![](media/RX.png)
4. Send Hex Buffer: Press send button, and then input `@hex` or `@hex:<your buffer byte>` to send Hex Buffer;  
5. Send File: Press send button, and then input `@file` or `@file:<your file path>` to send file.  

## Notice
If you use hex view on RX. It will be output in one line. You can paste this config text in setting.json to make it word wrap.
```json
"[Log]": {
    "editor.wordWrap": "on"
}
```

## Release Notes
### 0.0.10
- Fixed send button disappears.

### 0.0.9
- Support Hex View on RX.

### 0.0.8
- Update to support VSCode `1.59.0` on Mac OS(Linux not support yet).

### 0.0.7
- Update to support VSCode `1.59.0` on Windows OS(Mac and Linux not support yet).

### 0.0.6
- Added option `serialPort.enableEscapeCharacte` and support to send escape characte.

### 0.0.5
- Support DIY Baud Rate.

### 0.0.4
- Update preview image size in readme.

### 0.0.3
- Add send hex buffer command.
- Add send file command

### 0.0.2
- Add support Chinese.
- Add options list in config serial port.
- Add remember last serial port config.

### 0.0.1

- First Version, only baise feature.

-----------------------------------------------------------------------------------------------------------
### For more information

* [Serial Port Icon](https://iconscout.com/icons/serial-port) by [Microsoft](https://iconscout.com/contributors/fluent)

**Enjoy!**

/**
 * IpParser
 */
class IpParser {
    constructor() {}
    ip2int(ip) {
        let num = 0;
        ip = ip.split('.');
        num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
        num = num >>> 0;
        return num;
    }
    int2ip(num) {
        let str;
        const tt = new Array();
        tt[0] = (num >>> 24) >>> 0;
        tt[1] = ((num << 8) >>> 24) >>> 0;
        tt[2] = (num << 16) >>> 24;
        tt[3] = (num << 24) >>> 24;
        str = String(tt[0]) + '.' + String(tt[1]) + '.' + String(tt[2]) + '.' + String(tt[3]);
        return str;
    }
    int2binary(num) {
        let binary = num.toString(2);
        const _length = binary.length;
        for (let i = 0; i < 32 - _length; i++) {
            binary = '0' + binary;
        }
        return binary;
    }
    binary2int(binary){
        return parseInt(binary,2);
    }
    ip2binary(ip) {
        return this.int2binary(this.ip2int(ip));
    }
    binary2ip(binary) {
        return this.int2ip(this.binary2int(binary));
    }
    ips2CIDR(ips) {
        let returnArr = [];
        // 化整去重排序
        let intips = [];
        for (let index = 0; index < ips.length; index++) {
            intips.push(this.ip2int(ips[index]));
        }
        intips = Array.from(new Set(intips));
        intips = intips.sort();
        // 最长整数段
        let tempArr = [];
        for (let index = 0; index < intips.length; index++) {
            // 连前
            if (tempArr.length > 0 && tempArr[tempArr.length - 1] === intips[index] - 1) {
                tempArr.push(intips[index]);
            } else {
                // 不连前,处理、清空
                if (tempArr.length > 0) {
                    const tempBinaryArr = [];
                    for (let index = 0; index < tempArr.length; index++) {
                        const _binary_arr = this.ip2binary(this.int2ip(tempArr[index])).split('');
                        tempBinaryArr.push(_binary_arr);
                    }
                    returnArr = returnArr.concat(...this._cidr(tempBinaryArr));
                }
                tempArr = [];
                // 连后，存储
                if (intips[index + 1] && intips[index] === intips[index + 1] - 1) {
                    tempArr.push(intips[index]);
                } else {
                    // 不连后，处理
                    returnArr.push(this.int2ip(intips[index]) + '/32');
                }
            }
        }
        if (tempArr.length) {
            const tempBinaryArr = [];
            for (let index = 0; index < tempArr.length; index++) {
                const _binary_arr = this.ip2binary(this.int2ip(tempArr[index])).split('');
                tempBinaryArr.push(_binary_arr);
            }
            returnArr = returnArr.concat(...this._cidr(tempBinaryArr));
        }
        return returnArr;
    }
    _cidr(array) {
        if (array.length < 1) {
            return [];
        }
        let returnArr = [];
        if (array.length === 1) {
            returnArr.push(this.binary2ip(array[0].join('')) + '/32');
        } else {
            const _0 = [];
            const _1 = [];
            let countindex = 0;
            for (let i = 0; i < 32; i++) {
                const tempSet = new Set();
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    tempSet.add(element[i]);
                }
                if (tempSet.size === 2) {
                    countindex = i;
                    break;
                }
            }
            if (Math.pow(2, 32 - countindex) === array.length) {
                returnArr.push(this.binary2ip(array[0].join('')) + '/' + countindex);
            } else {
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    if (element[countindex] === '0') {
                        _0.push(element);
                    } else {
                        _1.push(element);
                    }
                }
                returnArr = returnArr.concat(...this._cidr(_1));
                returnArr = returnArr.concat(...this._cidr(_0));
            }
        }
        return returnArr;
    }
}

/**
 * Module exports.
 * @public
 */
module.exports = IpParser 

export class Buffer {
    constructor(byteLength) {
        this.buffer = new ArrayBuffer(byteLength)
        this.dataView = new DataView(this.buffer)
        this.index = 0
    }

    set(s, i, v) {
        if (s == 0) {
            this.dataView.setUint8(i, v)
        } else {
            this.dataView.setUint16(i, v)
        }
    }

    put(s, v) {
        if (s == 0) {
            this.dataView.setUint8(this.index++, v)
        } else {
            this.dataView.setUint16(this.index, v)
            this.index += 2
        }
    }

    get size() {
        return this.index
    }
}

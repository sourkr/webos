import { Buffer } from "./buf.js"

const code = new Buffer(512)
const data = new DataView(new ArrayBuffer(32))

const vars = new Map()
const var_uses = new Map()

const syms = new Map()
const sym_uses = new Map()

const B8 = 0
const B16 = 1

let i = 0, di = 0

export function assemble(str_asm) {
    console.log(compile(str_asm))

	eval(compile(str_asm))

    const v = new Map()

    vars.forEach((addr, name) => {
        v.set(name, code.index + addr)
    })

    var_uses.forEach((name, addr) => {
        if (syms.has(name)) {
            code.set(B16, addr, syms.get(name))
        } else if(v.has(name)) {
            code.set(B16, addr, v.get(name))
        } else {
            throw new Error(`cannot find variable '${name}'`)
        }
    })

    sym_uses.forEach((name, addr) => {
        if (!syms.has(name)) throw new Error(`cannot find symbol '${name}'`)
        code.set(B16, addr, syms.get(name))
    })

    console.log(new Uint8Array(code.buffer, 0, code.size))

    return String.fromCharCode(...new Uint8Array(code.buffer, 0, code.size),
        ...new Uint8Array(data.buffer, 0, di))
}

function compile(asm) {
    return asm
        .replaceAll(/;.*/g, "")
        .replaceAll(/\/\*.*?\*\//gs, "")
        .split(/\n+/)
        .map(a => a.trim())
        .filter(Boolean)
        .map(line => {
            let args = line.split(' ')
            const op = args.shift()

            args = args.join(' ')
                .split(',')
                .map(a => a.trim())
                .filter(Boolean)
                .map(a => {
                    if (a[0] == '$') return `"${a}"`
                    if (/\d/.test(a[0])) return a
                    if (a[0] == '"') return a
                    return `"${a}"`
                })

            return `${op}(${args})`
        }).join("\n")
}

function str(R1, R0) {
    code.setUint8(i++, 0x1)
    code.setUint8(i++, (compile_reg_old(R1) << 3) | compile_reg_old(R0))
}

function ldr(a, b) {
    if (b[1] == '$') {
        code.put(B8, 0x40 | 0b100)
        code.put(B8, compile_reg(a).id)
        var_uses.set(code.index, b.slice(1, -1))
        code.index +=  2
    } else {
        code.put(B8, 0x40)
	    code.put(B8, (compile_reg(a).id << 3) | compile_reg(b).id)
    }
}

function jmp(addr) {
    code.setUint8(i++, 0x04)
    // code.setUint8(i++, addr)
    var_uses.set(i++, addr)
}

function call(addr) {
    code.put(B8, 0x06)
    sym_uses.set(code.index, addr)
    code.index += 2
}

function push(expr) {
    if (typeof expr == "string") { // push reg
        const r = compile_reg(expr)
        code.put(B8, 0x10 | r.size)
        code.put(B8, r.id)
    } else { // push imm8
        code.put(B8, 0x10 | 0b100)
        code.put(B8, expr)
    }
}

function pop(reg) {
    code.setUint8(i++, 0x09)
    code.setUint8(i++, reg)
}

function drop(size) {
    code.put(B8, 0x0a)
    code.put(B8, size)
}

function ret() {
    code.put(B8, 0x0b)
}

function mov(a, b) {
    if (typeof a == "string") {
        if (a[0] == '$') {
            code.put(B8, 0x20 | B16)
            code.put(B8, compile_reg(b).id)
            var_uses.set(code.index, a)
            code.index += 2
        } else {
            const src = compile_reg(a)
            const dest = compile_reg(b)

            code.put(B8, 0x24 | src.size)
            code.put(B8, (src.id << 3) | dest.id)
        }
    } else { // mov imm, reg
        const r = compile_reg(b)

        code.put(B8, 0x20 | r.size)
        code.put(B8, r.id)
        code.put(r.size, a)
    }
}

function sub(a, b) {
    code.setUint8(i++, 0x07)
    code.setUint8(i++, (compile_reg_old(a) << 3) | compile_reg_old(b))
}

function add(a, b) {
    a = compile_reg(a)
    b = compile_reg(b)

    code.put(B8, 0x30 | a.size)
    code.put(B8, (a.id << 3) | b.id)
}

function syscall() {
	code.put(B8, 0x03)
}

function lable(name) {
    syms.set(name, code.index)
}

function u8(name, v) {
    vars.set(name, di)
    data.setUint8(di++, v)
}

function buf(name, v) {
    vars.set(name, di)

    for(let i = 0; i < v.length; i++) {
        data.setUint8(di++, v.charCodeAt(i))
    }
}

function compile_reg(r) {
    if (r[0] == '[') return compile_reg(r.slice(1, -1))

    if (r[0] == 'r') return { id: parseInt(r[1]), size: 0 }
    if (r[0] == 'w') return { id: parseInt(r[1]), size: 1 }
    // if (r[0] == 'x') return { id: parseInt(r[1]), size: 32 }

    if (r == 'sp') return { id: 5, size: 1 }
}

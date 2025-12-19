const DEBUG_STACK = false

const reg = new DataView(new ArrayBuffer(32))

const R0 = 0
const R1 = 1
const SP = 5

const R_SP = 20 + 2

const syscalls = new Map()

const B8 = 0
const B16 = 1

let mem
let pt

self.addEventListener("message", async ({ data }) => {
    switch(data.type) {
		case 'init':
            try {
                return await init(data)
            } catch (e) {
                log(e.stack)
            }
	}
})

let pc = 0

async function init(data) {
	mem = data.mem
    pt = data.pt
    pc = data.pc

    syscalls.set(0x20, sleep)

    reg.setUint16(R_SP, 1023)

    while(pc < 511) {
        const _pc = pc
        const opcode = next(B8)

        const base = opcode & 0xf0
        const meta = opcode & 0x0f

        switch(base) {
            case 0x00:
                await base0(_pc, opcode, meta)
                break;

            case 0x10: { // push
                const size = meta & 0b0011
                const a = next(B8)

                if (meta & 0b0100) { // push imm8
                    log(`push ${a}`)
                    push(size, a)
                } else {
                    log("push", reg_name(size, a))
                    push(size, reg_get(size, a))
                }

                // printStack()
                break
            }

            case 0x20: { // mov
                const size = meta & 0b0011

                if (meta & 0b0100) { // mov r1, r2
                    const r = next(B8)
                    const r2 = r & 0b111
                    const r1 = (r & 0b111000) >> 3
                    log(_pc, "mov", reg_name(size, r1), reg_name(size, r2))
                    reg_set(size, r2, reg_get(size, r1))
                } else { // mov imm, reg
                    const r = next(B8)
                    const c = next(size)
                    log(_pc, "mov", c, reg_name(size, r))
                    reg_set(size, r, c)
                }

                break
            }

            case 0x30: { // add reg, reg
                const size = meta & 0b0011
                const r = next(B8)
                const src = (r >> 3) & 0b111
                const dst = r & 0b111

                log("add", reg_name(size, src), reg_name(size, dst))
                reg_set(size, dst, reg_get(size, src) + reg_get(size, dst))
                break
            }

            case 0x40: { // ldr
                const r = next(B8)

                if (meta & 0b100) {
                    const addr = next(B16)
                    log("ldr", reg_name(B8, r), `[=${addr}]`)
                    reg_set(B8, r, mem_get(B8, addr))  
                } else {
                    const a = (r >> 3) & 0b111
                    const b = r & 0b111
                    log("ldr", reg_name(B8, a), `[${reg_name(B16, b)}]`)
                    reg_set(B8, a, mem_get(B8, reg_get(B16, b)))
                }

                break
            }

		    default:
			    console.error('unknown opcode')
                log('unknown opcode: ' + opcode)
			    return
	    }
    }

    log("Seg fault")
}

async function base0(_pc, opcode, meta) {
    switch(meta) {
        case 0x01: { // str R0, [R1]
            const r = mem.getUint8(next())
            const R1 = (r & 0b111) * 4 + 3
            const R0 = ((r & 0b111000) >> 3) * 4 +3
            log(`str ${reg_name(R0)}, [${reg_name(R1)}]`)
            mem.setUint8(reg.getUint8(R1), reg.getUint8(R0))
            break
        }

        case 0x03: { // syscall
            const number = reg_get(B8, R0)
            log(`syscall {${number}}`)
            await syscall(number)
            break
        }

            case 0x04: { // jmp addr
                const addr = mem.getUint8(next())
                log(`jmp ${addr}`)
                reg.setUint8(PC, addr)
                break
            }

        case 0x06: { // call addr
            const addr = next(B16)
            log(_pc, "call", addr)
            push(B16, pc)
            pc = addr

            if (DEBUG_STACK) printStack()
            break
        }

            case 0x07: { // sub R0, R1
                const r = mem.getUint8(next())
                const R1 = (r & 0b111) * 4 + 3
                const R0 = ((r & 0b111000) >> 3) * 4 +3
                log(`sub ${reg_name(R0)}, ${reg_name(R1)}`)
                reg.setUint8(R1, reg.getUint8(R1) - reg.getUint8(R0))
                break
            }

            case 0x09: { // pop R0
                const R0 = mem.getUint8(next()) * 4 + 3
                log(`pop ${reg_name(R0)}`)
                reg.setUint8(R_SP, reg.getUint8(R_SP) + 1) // sp++
                reg.setUint8(R0, mem.getUint8(reg.getUint8(R_SP))) // R0 = mem[sp]
                // printStack()
                break
            }

        case 0x0a: { // drop
            const size = next(B8)
            log(`drop ${size}`)
            reg_set(B16, SP, reg_get(B16, SP) + size)
            // printStack()
            break
        }

        case 0x0b: { // ret
            const fp = pop(B16)
            log(`ret {${fp}}`)
            pc = fp
            // printStack()
            break
        }

        default:
            console.error('unknown opcode')
            log('unknown opcode: ' + opcode)
            syscall(0)
			return
    }
}

function push(size, v) {
    let sp = reg_get(B16, SP)

    if (size == 0) mem_set(B8, sp, v)
    else mem_set(B16, --sp, v)

    reg_set(B16, SP, sp - 1)
}

function pop(size, v) {
    const sp = reg_get(B16, SP) + 1
    reg_set(B16, SP, sp + size)
    return mem_get(size, sp)
}

function reg_get(size, id) {
    if (size == 0) return reg.getUint8(id * 4 + 3)
    else return reg.getUint16(id * 4 + 2)
}

function reg_set(size, id, v) {
    if (size == 0) return reg.setUint8(id * 4 + 3, v)
    else return reg.setUint16(id * 4 + 2, v)
}


// Memory Mangment
function mem_set(size, addr, v) {
    if (size == B8) {
        const p = pt[addr >> 9]
        
        if (!p || !p.perm[1]) {
            log("Segfault 3")
            throw "segfault"
        }

        mem.setUint8((p.index << 9) | (addr & 0x1ff), v)
    } else {
        mem_set(B8, addr, v >> 8) | mem_set(B8, addr + 1, v & 0xff)
    }
}

function mem_get(size, addr, perm_exec) {
    if (size == B8) {
        const p = pt[addr >> 9]

        if (!p || !p.perm[0]) {
            log("Segfault")
            throw "Segfault"
        }

        if (perm_exec && !p.perm[2]) {
            log(perm_exec, p)
            log("Segfault 2")
            throw "segfault"
        }

        return mem.getUint8((p.index << 9) | (addr & 0x1ff))
    }

    return (mem_get(B8, addr, perm_exec) << 8)
        | mem_get(B8, addr + 1, perm_exec)
}

function next(size) {
    const v = mem_get(size, pc, true)
    pc += size + 1
    return v
}


// Syscalls
async function syscall(n) {
    if (n < 0x20) {
        self.postMessage({ type: "syscall", n, reg, pc })
    } else {
        await syscalls.get(n)()
    }
}


async function sleep() {
    log(`sleep(${reg_get(B8, R1)})`)
    return new Promise((resolve, _) => {
        setTimeout(resolve, reg_get(B8, R1) * 1000)
    })
}

function log(...msg) {
    self.postMessage({ type: "log", msg })
}

function handle(func) {
    // try {
        func()
    // } catch (e) {
    //     log(e.stack)
    // }
}

function reg_name(size, id) {
    if (id == SP) return "sp"

    if (size == 0) return 'r' + id
    if (size == 1) return 'w' + id

    return `reg(${size}, ${id})`
}

function printStack() {
    const sp = reg_get(B16, SP)
    const pe = (sp >> 9) | 0x1ff
    
    log(sp, new Uint8Array(mem.buffer, sp + 1, 512 - ((sp + 1) & 0x1ff)))
}

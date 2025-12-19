import { assemble } from "./asm.js"

const B16 = 1

const PTR_SIZE = 2

export async function compile(code) {
    let ctx = {
        type: "file",
        globals: new Map(),
        set(nctx) {
            ctx = nctx
        }
    }

    let asm = (await preprocess(code))
        .replaceAll(/\/\/.*/g, "")
        .split(/\n+/)
        .map(line => line
            // .replace(/char (\w+) = (\d+);/, (_, ...a) => compile_char_def(ctx, ...a))
            .replace(/char \*(\w+) = "(.*?)";/, (_, ...a) => compile_chat_ptr_def(ctx, ...a))
            .replace(/asm\("(.+?)" :.*?:(.+?)\);/, (_, asm, inps) => indent(compile_asm(ctx, asm, null, inps), true).join("\n"))
            .replace(/(\w+) (\w+)\((.*?)\) \{/, (_, type, name, args) => compile_func_dec(ctx, type, name, args))
            .replace(/\}/, () => indent(compile_cb(ctx)).join('\n'))
            .replace(/(\s*)char (\w+) = (.+);/, (_, s, name, expr) => {
                switch(ctx.type) {
                    case "file":
                        ctx.globals.set(name, "char")
                        return `u8 $${name}, ${expr}`

                    case "func":
                        ctx.locals.set(name, { type: "char", index: ctx.index++ })
                        ctx.localSize++
                        // console.log(indent(compile_expr(ctx, expr)))
                        return indent(compile_expr(ctx, expr)).join("\n")
                }

                console.warn(`var dec: unsupported context type "${ctx.type}"`)
            })
            // function call
            .replace(/(\s*)(\w+)\((.*)\);/, (_, s, name, args) => {
                let size = 0

                /* ctx = {
                    type: "func",
                    globals: ctx.globals,
                    args: args.split(',')
                        .map(a => a.trim())
                        .map(a => a.split(" "))
                        .map(a => ({ name: a[1], type: a[0] }))
                } */



                return [
                    ...args.split(',')
                        .map(a => a.trim())
                        .filter(Boolean)
                        .map(a => {
                            return compile_expr({ ...ctx, argSize: size++ }, a)
                        }).flat(),
                    `call $${name}`,
                    `drop ${size}`
                ].join("\n")
                    .split('\n')
                    .map((a, i) => s+a)
                    .join('\n')
            })
            .replace(/return (\w+)\+\+;/, (_, name) => {
                ctx.isReturned = true
                return [
                    `ldr r0, [$${name}]`,
                    "    ret"
                ].join('\n')
            })
        )

    asm = `call $main
mov r0, r1
mov 0, r0
syscall

${asm.join('\n')}`

    console.log(asm)

    return assemble(asm)
}

function compile_char_def(ctx, name, expr) {
    ctx.globals.set(name, "char")
    return `u8 $${name}, ${expr}`
}

function compile_chat_ptr_def(ctx, name, expr) {
    ctx.globals.set(name, "char*")
    return `buf $${name}, "${expr}"`
}

function compile_asm(ctx, asmc, _outs, inps) {
    const mctx = { used: [] }

    inps = inps.split(',')
        .map(a => a.trim())
        .map(a => {
            const lines = []

            a.replace(/"(.+)"\((.*)\)/, (_, reg, expr) => {
                if (/(?:0x)?\d+/.test(expr)) {
                    return `mcb ${expr}, ${reg}`
                } else {
                    const arg = ctx.args.find(a => a.name == expr)

                    if (arg) {
                        let r1 = next_reg(B16, mctx)
                        const r2 = 'w' + next_reg(B16, { used: [...mctx.used, r1] })

                        r1 = 'w' + r1

                        const asm = [
                            `mov sp, ${r1}`,
                            `mov ${arg.index + 3}, ${r2}`,
                            `add ${r2}, ${r1}`,
                            `ldr ${reg}, [${r1}]`
                        ]

                        mctx.used.push(parseInt(reg[1]))
                        lines.push(...asm)
                    }
                }
            })

            return lines
        }).flat()

    const asm = [
        ...inps,
        asmc
    ]

    return asm
}

function compile_func_dec(ctx, type, name, args) {
    let i = 0

    ctx.set({
        type: "func",
        size: 0,
        args: args.split(',')
            .map(a => a.trim())
            .filter(Boolean)
            .toReversed()
            .map(a => {
                const b = a.split(" ")

                return {
                    name: b[1],
                    type: b[0],
                    index: i++
                }

                ctx.size++
            }).toReversed(),

        index: i,
        locals: new Map(),
        localSize: 0,

        parent: ctx,
        globals: ctx.globals,
        set: ctx.set
    })

    return [
        `lable $${name}`,
    ].join('\n')
}

function compile_cb(ctx) {
    ctx.set(ctx.parent)

    if (ctx.isReturned) return []
    return [
        `drop ${ctx.localSize}`,
        "ret"
    ]
}

function compile_expr(ctx, expr) {
    if (/(?:0x)?\d+/.test(expr)) {
        return [ `push ${expr}` ]
    }

    if (/\w+\(.*\)/.test(expr)) { // function call
        const [_, name, args] = /(\w+)\((.*)\)/.exec(expr)
        let size = 0

        return [
            ...args.split(',')
                .map(a => a.trim())
                .filter(Boolean)
                .map(a => {
                    size++
                    return compile_expr(ctx, a)
                }),
            `call $${name}`,
            `drop ${size}`,
            `push r0`
        ]
    }

    const global_var = ctx.globals.get(expr)

    if(global_var) {
        if (global_var.at(-1) == '*') {
            return [
                `sub 1, sp`,
                `str $${expr}, sp`
            ]
        } else {
            return [
                `ldr r0, [$${expr}]`,
                `push r0`
            ]
        }
    }

    const local_var = ctx.locals.get(expr)

    if (local_var) {
        return [
            `mov ${local_var.index + 1}, w0`,
            `add sp, w0`,
            `ldr r0, [w0]`,
            `push r0`
        ]
    }

    const arg = ctx.args.find(a => a.name == expr)

    console.log(arg, ctx.localSize, ctx.argSize)

    if (!arg) throw new Error(`cannot find variable '${name}'`)

    return [
        `mov ${arg.index + 1 + PTR_SIZE + ctx.localSize + (ctx.argSize ?? 0)}, w0`,
        `add sp, w0`,
        `ldr r0, [w0]`,
        `push r0`
    ]

    return `undefined`
}


function next_reg(size, ctx) {
    for(let i = 0; i < 4; i++) {
        if (!ctx.used.includes(i)) return i
    }
}

async function preprocess(code, defs = create_preprocess_context()) {
    const lines = code.split(/\n+/)

    let is_ifndef = false

    for(let i = 0; i < lines.length; i++) {
        if (/#endif/.test(lines[i])) {
            is_ifndef = false
            lines[i] = ""
            continue
        }

        if (is_ifndef) {
            lines[i] = ''
            continue
        }

        if (/#include [<"].*[">]/.test(lines[i])) {
            const name = lines[i].replace(/#include ["<](.*)[">]/, "$1")
            const code = await (await fetch('/i/stdlibs/' + name)).text()
            lines[i] = await preprocess(code, defs)
            continue
        }

        if (/#define \w+ .+/.test(lines[i])) {
            const [_, name, expr] = lines[i].split(' ')
            defs.named.set(name, expr)
            lines[i] = ""
            continue
        }

        if (/#define \w+/.test(lines[i])) {
            const [_, name] = lines[i].split(' ')
            defs.unnamed.add(name)
            lines[i] = ""
            continue
        }

        if (/#ifndef \w+/.test(lines[i])) {
            const [_, name] = lines[i].split(' ')
            is_ifndef = defs.unnamed.has(name)
            lines[i] = ""
            continue
        }

        defs.named.forEach((expr, name) => {
            if (lines[i].includes(name)) {
                lines[i] = lines[i].replace(name, expr)
            }
        })
    }

    return lines.join('\n')
}

function create_preprocess_context() {
    return {
        unnamed: new Set(),
        named: new Map()
    }
}

function indent(a, skipFirst) {
    return a.map((line, i) => (skipFirst && i == 0) ? line : `    ` + line)
}

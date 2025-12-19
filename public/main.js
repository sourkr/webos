const PAGE_SIZE = 512
const PAGE_COUNT = 4

const mem = new DataView(new SharedArrayBuffer(PAGE_COUNT * PAGE_SIZE))
const syscalls = new Map()

const procs = new Map()
const pages = []

let procc = 1

function main() {
    loadApps()
    init()
    
    /* funcs.set("win-create", windowCreate);
    funcs.set("buffer-insert", insert);
    funcs.set("term-view-set-color", set_color);
    funcs.set("term-view-reset-style", clear_style); */
}

function init() {
    if (window.innerWidth > 768) {
        const startMenu = document.getElementById('menu-start');
        const startButton = document.getElementById('btn-start');
        startMenu.setAttribute('popover', '');
        startButton.setAttribute('popovertarget', 'menu-start');
    }

    syscalls.set(0x00, exit)
    syscalls.set(0x01, fork)
    
    syscalls.set(0x0a, window_create)
    syscalls.set(0x0b, /* window_set_title */)
    syscalls.set(0x0c, window_set_child)
    syscalls.set(0x0d, window_show)
    
    syscalls.set(0x10, term_view_new)
    syscalls.set(0x11, term_view_insert)
}

function loadApps() {
    const menu = document.getElementById("app-list");
    
    const apps = localStorage.getItem("/apps")
        .split('\n')
        .filter(Boolean)
        .map(entry => entry.split(' ')[1])
        .map(file => localStorage.getItem("/apps/" + file))
        .map(entry => entry.split('\n')
            .map(line => line.split(' ', 2))
            .reduce((map, [k, v]) => (map[k] = v, map), {}))
            
    apps.forEach(appInfo => {
        const item = document.createElement("div")
        
        item.innerText = appInfo.name
        
        item.onclick = () => exec(appInfo.exec)
        
        menu.append(item)
    });
}

function exec_base(worker, pid) {
    worker.onmessage = ({ data }) => {
        switch (data.type) {
            case "syscall":
                const func = syscalls.get(data.n)
                if (!func) throw new Error(`'${data.n}' is not a valid syscall number`)
                func(pid, data.reg, data.pc);
                break
            case "log":
                console.log(...data.msg)
                break
        }
    }
}

async function exec(path) {
    const bin = localStorage.getItem(path)
    const worker = new Worker("vm.js")
    const pid = procc++
    
    for(let i = 0; i < bin.length; i++) {
        mem.setUint8(i, bin.charCodeAt(i))
    }
    
    procs.set(1, {
        wins: new Map(),
        views: new Map(),
        worker
    })
    
    const pt = [
        { type: "normal", index: 0, perm: [1, 1, 1] },
        { type: "normal", index: 1, perm: [1, 1, 0] }
    ]

    pages[0] = 1
    pages[1] = 1

    worker.postMessage({ type: "init", mem, pt, pc: 0 })
    
    exec_base(worker, pid)
    
    return pid
}

function exit(pid, _reg, _pc) {
    const proc = procs.get(pid)
    
    proc.worker.terminate()
    
    proc.wins.values().forEach(win => win.win.remove())
    
    procs.delete(pid)
}

function fork(pid, _, pc) {
    const worker = new Worker("vm.js") 

    const pt = [
        { type: "forked", index: 0, perm: [1, 1, 1] },
        { type: "forked", index: 1, perm: [1, 1, 0] }
    ]

    worker.postMessage({
        type: "init",
        pc, pt, mem
    })

    exec_base(worker, 2)
}

function window_create(pid, reg) {
    console.log("window_create")
    const template = document.getElementById("window")
    const root = template.content.cloneNode(true)
    const win = root.querySelector(".window");
    const titlebar = win.querySelector(".titlebar")
    
    if (window.innerWidth <= 768) {
        win.classList.add('fullscreen');
        win.style.background = "red"
    } else {
        // titlebar.innerText = data.title
        // win.querySelector(".content").appendChild(createContent(data.child.id).can);
        const winDragger = new Dragable((x, y) => {
            win.style.left = `${x}px`
            win.style.top = `${y}px`
        })
        
        const handleRight = new Dragable((w, _) => {
            win.style.width = `${300 + w}px`
        })
        
        const handles = [
            ["titlebar", winDragger],
            ["handle-right", handleRight],
        ]
        
        handles.forEach(([className, dragable]) => {
            const element = win.querySelector(`.${className}`)
            element.onmousedown = ev => {
                prevX = ev.clientX
                prevY = ev.clientY
                dragging = dragable
            }
        })
        
        titlebar.onmousedown = ev => {
            prevX = ev.clientX
            prevY = ev.clientY
            dragging = winDragger
        }
    }
    
    procs.get(pid).wins.set(u8_r1(reg), { win })
}

function window_show(pid, reg) {
    const winid = u8_r1(reg)
    console.log("window_show")
    const win = procs.get(pid).wins.get(winid)
    if (!win) throw new Error(`cannot find window with id '${winid}'`) 
    document.body.appendChild(win.win)
}

function window_set_child(pid, reg) {
    const win = procs.get(pid).wins.get(u8_r1(reg))
    const content = procs.get(pid).views.get(u8_r2(reg))
    
    win.win.querySelector(".content").appendChild(content.root)
}

function term_view_new(pid, reg) {
    console.log("term_view_new")
    const can = document.createElement("canvas")
    const ctx = can.getContext("2d")
    
    ctx.font = "12px Monospace"
    
    const metric = ctx.measureText(']')
    const charWidth = metric.width
    const charHeight = metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent
    
    const view = {
        type: "term_view",
        root: can,
        cursorX: 0,
        cursorY: 0,
        ctx, charWidth, charHeight,
        drawCursor
    }
    
    procs.get(pid).views.set(u8_r1(reg), view)
    
    function drawCursor() {
        ctx.fillStyle = "black"
        ctx.fillRect(view.cursorX * charWidth, view.cursorY * charHeight, charWidth, charHeight)
    }
    
    drawCursor()
}

function term_view_insert(pid, reg) {
    let addr = u8_r2(reg)
    const buf = []
    
    console.warn({ addr })
    
    return
    while(true) {
        const ch = mem.getUint8(addr++)
        if (ch == 0) break
        buf.push(ch)
    }
    
    const text = String.fromCharCode(...buf)
    const view = procs.get(pid).views.get(u8_r1(reg))
    const ctx = view.ctx
    
    // clear cursor
    ctx.fillStyle = "white"
    ctx.fillRect(view.cursorX * view.charWidth,
        view.cursorY * view.charHeight,
        view.charWidth, view.charHeight)
    
    ctx.fillStyle = "black"
    ctx.fillText(text, view.cursorX * view.charWidth,
        view.cursorY * view.charHeight + view.charHeight)
    
    view.cursorX += text.length
    view.drawCursor()
}

function u8_r1(reg) {
    return reg.getUint8(4 + 3)
}

function u8_r2(reg) {
    return reg.getUint8(8 + 3)
}

class Dragable {
    #x = 0;
    #y = 0;
    #func;
    constructor(func) {
        this.#func = func;
    }
    moveBy(dx, dy) {
        this.#func((this.#x += dx), (this.#y += dy));
    }
}

main();

import { compile } from "./zero.js"
// import { assemble } from './asm.js'

const bar = document.getElementById('bar')
const status = document.getElementById('status')

let totalFiles = 0
let filesInstalled = 0

async function install() {
	localStorage.clear()
	localStorage.setItem('/', '')

	totalFiles = await countFiles('../fs')
	
	await copy('../fs', "")

    status.innerText = "Inatallation Completed Successfully."
}

async function countFiles(webdir) {
	const paths = (await (await fetch(webdir + '/' + "paths.txt")).text())
		.split(/\n+/)
		.filter(Boolean)
	
	let count = paths.length

	for(const path of paths) {
		const args = path.split(/\s+/)
		if (args[0] == 'd') {
			count += await countFiles(webdir + '/' + args[2])
		}
	}

	return count
}

async function copy(webdir, dir) {
	const paths = (await (await fetch(webdir + '/' + "paths.txt")).text())
		.split(/\n+/)
		.filter(Boolean)

	for(const path of paths) {
		const args = path.split(/\s+/)
		const p = dir + '/' + args[3]
		const _parent = parent(p)

		const list = localStorage.getItem(_parent)
			.split('\n')
			.filter(Boolean)

		list.push(`${args[0]} ${name(args[3])}`)

		localStorage.setItem(_parent, list.join('\n'))

		if (args[0] == 'd') {			
			localStorage.setItem(p, '')
			await copy(webdir + '/' + args[2], p)
		} else {
			const content = await (await fetch(webdir + '/' + args[2])).text()
            
            if (args[1] == 'c') {
                const data = await compile(content)
			    localStorage.setItem(p, data)
            } else {
                localStorage.setItem(p, content)
            }
		}

		filesInstalled++
		const progress = (filesInstalled / totalFiles) * 100
		bar.style.width = progress + '%'
		status.innerText = `Installing ${p}`
	}
}

function parent(path) {
	// console.log(path.split('/').filter(Boolean))
	return '/' + path.split('/').filter(Boolean).slice(0, -1).join('/')
}

function name(path) {
	return path.split('/').slice(-1)[0]
}

document.getElementById('install').onclick = install

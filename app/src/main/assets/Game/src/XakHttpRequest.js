var GLTF

(function () {
	var text = atob(src[0].split(',')[1]).split('')
	var arr = new Uint8Array(text.length)
	text.forEach((el, i) => arr[i] = el.charCodeAt(0))
	GLTF = UZIP.parse(arr)
	window.dispatchEvent(new Event('AllFilesLoaded'))
})()


class XMLHttpRequest {

	open( text, url, aBool ) {
		console.log(url)
		var name = url.split('./').pop()
		this.response = GLTF[name].buffer
		this.status = 200
	}

	addEventListener( text, def ) {
		if ( text === 'load' ) this.onLoad = def
	}

	send() {
		this.onLoad()
	}
}


function fetch(url, options) {
	return new Promise( (resolve, reject) => {
		var name = url.split('./').pop()
		resolve({
			ok: true,
			status: 200,
			blob: function() {
				return new Blob([GLTF[name]], {type: 'image/png'})
			}
		})
	})
}

(function () {
	const el = n => document.querySelector(n)
	var name = [
		'#icon-bar-stats',
		'#icon-bar-inventory',
		'#icon-bar-quests',
		'.inventory-character'
	]
	var source = [
		'./resources/icons/ui/skills.png',
		'./resources/icons/ui/backpack.png',
		'./resources/icons/ui/tied-scroll.png',
		'./resources/icons/ui/inventory-character.png'
	]
	window.addEventListener('AllFilesLoaded', () => {
		source.forEach((s, i) => {
			fetch(s).then(res => res.blob()).then(img => {
				var url = URL.createObjectURL(img)
				el(name[i]).style = 'background-image: url(' + url + ')'
			})
		})
	})
})()
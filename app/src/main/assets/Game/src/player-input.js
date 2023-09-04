const player_input = (() => {

	class PickableComponent extends entity.Component {
		constructor() {
			super();
		}

		InitComponent() {
		}
	};

	class BasicCharacterControllerInput extends entity.Component {
		constructor(params) {
			super();
			this._params = params;
			this._Init();
		}

		_Init() {
			this._keys = {
				forward: false,
				backward: false,
				left: false,
				right: false,
				space: false,
				shift: false,
			};
			this._raycaster = new THREE.Raycaster();
			document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
			document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
			//document.addEventListener('mouseup', (e) => this._onMouseUp(e), false);
			this.onTouchScreen(this._keys);
		}

		_onMouseUp(event) {
			const rect = document.getElementById('threejs').getBoundingClientRect();
			const pos = {
				x: ((event.clientX - rect.left) / rect.width) * 2  - 1,
				y: ((event.clientY - rect.top ) / rect.height) * -2 + 1,
			};

			this._raycaster.setFromCamera(pos, this._params.camera);

			const pickables = this._parent._parent.Filter((e) => {
				const p = e.GetComponent('PickableComponent');
				if (!p) {
					return false;
				}
				return e._mesh;
			});

			const ray = new THREE.Ray();
			ray.origin.setFromMatrixPosition(this._params.camera.matrixWorld);
			ray.direction.set(pos.x, pos.y, 0.5).unproject(
					this._params.camera).sub(ray.origin).normalize();

			// hack
			document.getElementById('quest-ui').style.visibility = 'hidden';

			for (let p of pickables) {
				// GOOD ENOUGH
				const box = new THREE.Box3().setFromObject(p._mesh);

				if (ray.intersectsBox(box)) {
					p.Broadcast({
							topic: 'input.picked'
					});
					break;
				}
			}
		}

		_onKeyDown(event) {
			switch (event.keyCode) {
				case 87: // w
					this._keys.forward = true;
					break;
				case 65: // a
					this._keys.left = true;
					break;
				case 83: // s
					this._keys.backward = true;
					break;
				case 68: // d
					this._keys.right = true;
					break;
				case 32: // SPACE
					this._keys.space = true;
					break;
				case 16: // SHIFT
					this._keys.shift = true;
					break;
			}
		}

		_onKeyUp(event) {
			switch(event.keyCode) {
				case 87: // w
					this._keys.forward = false;
					break;
				case 65: // a
					this._keys.left = false;
					break;
				case 83: // s
					this._keys.backward = false;
					break;
				case 68: // d
					this._keys.right = false;
					break;
				case 32: // SPACE
					this._keys.space = false;
					break;
				case 16: // SHIFT
					this._keys.shift = false;
					break;
			}
		}

		buttonPush(event, keys) {
			_APP.playMusic()
			var x, y
			var t = event.changedTouches
			if (t) {
				x = t[0].pageX
				y = t[0].pageY
			} else {
				x = event.clientX
				y = event.clientY
			}
			var sX = window.innerWidth
			var sY = window.innerHeight
			var dx = sX / 100, dy = sY / 100
			if (x > sX / 2) {
				keys.space = true
				console.log('space')
				return
			}
			if (x > 15*dx && x < 15*dx + 10*dx) {
				if (y < 75*dy) {
					console.log('up')
					keys.forward = true
				} else {
					console.log('down')
					keys.backward = true
				}
			} else if (x < 15*dx) {
				console.log('left')
				keys.left = true
			} else {
				console.log('right')
				keys.right = true
			}
		}

		buttonRelease(event, keys) {
			for (var k in keys) keys[k] = false
			keys['shift'] = true
		}

		onTouchScreen(keys) {
			var timer = setInterval(() => {
				if (!_APP) return
				_APP._threejs.domElement.addEventListener('mousedown', e => this.buttonPush(e, keys))
				_APP._threejs.domElement.addEventListener('mouseup', e => this.buttonRelease(e, keys))
				_APP._threejs.domElement.addEventListener('touchstart', e => this.buttonPush(e, keys))
				_APP._threejs.domElement.addEventListener('touchend', e => this.buttonRelease(e, keys))
				document.querySelectorAll('div').forEach((a, i) => {
					if (i != 0) a.remove()
				})
				clearInterval(timer)
			}, 300)
		}
	};

	return {
		BasicCharacterControllerInput: BasicCharacterControllerInput,
		PickableComponent: PickableComponent,
	};

})();
/* global THREE */

class Flocker {
	constructor(x, y, z) {
		this.createMesh(x, y, z);

		this.vector = {
			x: 0.0,
			y: 0.0,
		};
	}

	createMesh(x, y, z) {
		const geometry = new THREE.CircleGeometry(Flocker.SIZE,
				Flocker.MESH_DIVISIONS);
		const material = new THREE.MeshBasicMaterial({ color: 0xFF00FF });
		const circle = new THREE.Mesh(geometry, material);

		circle.position.set(x, y, z);

		this.mesh = circle;
	}

	updateVector(mousePosition) {
		const meshPos = { x: this.mesh.position.x, y: this.mesh.position.y };
		const v = { 
			x: mousePosition.x - meshPos.x, 
			y: mousePosition.y + meshPos.y,
		};

		const vLen = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

		const u = {
			x: v.x / vLen || 0,
			y: v.y / vLen || 0,
		};

		this.vector = u;
		console.log(this.vector);
	}

	update() {
		this.mesh.position.x += this.vector.x;
		this.mesh.position.y -= this.vector.y;
	}

	static genX(num) {
		const padding = 10;
		const res = [];

		for (let i = 0; i < num; i++) {
			res.push(new Flocker(i * Flocker.SIZE + padding, 0, 0));
		}

		return res;
	}
}
Flocker.SIZE = 20;
Flocker.MESH_DIVISIONS = 20;

class FlockerGroup {
	constructor(num) {
		this.flockers = Flocker.genX(num);
		this.updateFlockerVectors = this.updateFlockerVectors.bind(this);
	}

	updateFlockerVectors(event) {
		this.flockers.forEach(flocker => {
			flocker.updateVector({ x: event.clientX, y: event.clientY });
		});
	}

	addToScene(scene) {
		this.flockers.forEach(flocker => {
			scene.add(flocker.mesh);
		});
	}

	update() {
		this.flockers.forEach(flocker => flocker.update());
	}

	registerCallbacks() {
		document.addEventListener('mousemove', this.updateFlockerVectors);
	}
}

class FlockMain {
	constructor() {
		this.updateRenderer();
		this.updateCamera();
		
		this.scene = new THREE.Scene();

		this.createFlockerGroup();

		this.loop = this.loop.bind(this);
	}

	init() {
		document.getElementById('main').appendChild(this.renderer.domElement);
		this.registerCallbacks();
	}

	createFlockerGroup() {
		this.flockerGroup = new FlockerGroup(10);
		this.flockerGroup.addToScene(this.scene);
	}

	registerCallbacks() {
		this.flockerGroup.registerCallbacks();

		window.addEventListener('resize', () => {
			this.updateRenderer();
			this.updateCamera();
		});
	}

	updateRenderer() {
		if (this.renderer === undefined) {
			this.renderer = new THREE.WebGLRenderer();
		}

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	updateCamera() {
		this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, 
				window.innerWidth / 2, window.innerHeight / 2, 
				window.innerHeight / -2, 1, 1000);

		this.camera.position.z = 500;
		this.camera.position.x = window.innerWidth / 2;
		this.camera.position.y = -window.innerHeight / 2;
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update() {
		this.flockerGroup.update();
	}

	loop() {
		requestAnimationFrame(this.loop);
		this.update();
		this.render();
	}
}

const main = new FlockMain();
main.init();
main.loop();

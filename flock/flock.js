/* global THREE */

class Flocker {
	constructor(x, y, z, color) {
		this.createMesh(x, y, z, color);

		this.position = {
			x: this.mesh.position.x,
			y: -this.mesh.position.y,
		};

		this.lastKnownMousePosition = {
			x: 0.0,
			y: 0.0,
		};

		this.mouseVector = {
			x: 0.0,
			y: 0.0,
		};

		this.displacementVector = {
			x: 0.0,
			y: 0.0,
		};
	}

	createMesh(x, y, z, color) {
		const geometry = new THREE.CircleGeometry(Flocker.SIZE,
				Flocker.MESH_DIVISIONS);
		const material = new THREE.MeshBasicMaterial({ color });
		const circle = new THREE.Mesh(geometry, material);

		circle.position.set(x, y, z);

		this.mesh = circle;
	}

	setMousePosition(mousePosition) {
		this.lastKnownMousePosition = mousePosition;
	}

	updateMouseVector() {
		const meshPos = { x: this.mesh.position.x, y: this.mesh.position.y };
		const v = { 
			x: this.lastKnownMousePosition.x - meshPos.x, 
			y: this.lastKnownMousePosition.y + meshPos.y,
		};

		const vLen = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

		const u = {
			x: v.x / vLen || 0,
			y: v.y / vLen || 0,
		};

		this.mouseVector = u;
	}

	updateDisplacementVector() {
		this.displacementVector.x += this.mouseVector.x;
		this.displacementVector.y += this.mouseVector.y;

		this.displacementVector.x = 
			Math.sign(this.displacementVector.x) * 
			Math.min(Math.abs(this.displacementVector.x), Flocker.MAX_SPEED);
		this.displacementVector.y =
			Math.sign(this.displacementVector.y) *
			Math.min(Math.abs(this.displacementVector.y), Flocker.MAX_SPEED);
	}

	updatePosition() {
		this.position.x += this.displacementVector.x;
		this.position.y += this.displacementVector.y;

		this.project();
	}

	project() {
		this.mesh.position.x = this.position.x;
		this.mesh.position.y = -this.position.y;
	}

	update() {
		this.updateMouseVector();
		this.updateDisplacementVector();
		this.updatePosition();
	}

	static genX(num) {
		const padding = 10;
		const res = [];

		for (let i = 0; i < num; i++) {
			res.push(new Flocker(Math.random() * window.innerWidth, 
						-Math.random() * window.innerHeight, 0,
						Math.random() * Math.pow(256, 3) 
						+ Math.random() * Math.pow(256, 2)
						+ Math.random() * 256));
		}

		return res;
	}
}
Flocker.SIZE = 20;
Flocker.MESH_DIVISIONS = 20;
Flocker.MAX_SPEED = 13;

class FlockerGroup {
	constructor(num) {
		this.flockers = Flocker.genX(num);
		this.updateFlockerVectors = this.updateFlockerVectors.bind(this);
		this.updateFlockerVectorsTouch = 
			this.updateFlockerVectorsTouch.bind(this);
	}

	updateFlockerVectors(event) {
		this.flockers.forEach(flocker => {
			flocker.setMousePosition({ x: event.clientX, y: event.clientY });
		});
	}

	updateFlockerVectorsTouch(event) {
		this.flockers.forEach(flocker => {
			flocker.setMousePosition({
				x: event.targetTouches[0].clientX,
				y: event.targetTouches[0].clientY,
			});
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
		document.addEventListener('touchmove', this.updateFlockerVectorsTouch);
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
		this.flockerGroup = new FlockerGroup(20);
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
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
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

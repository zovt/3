class Flocker {
	constructor(x, y, z) {
		this.mesh = this.createMesh(x, y, z);
	}

	createMesh(x, y, z) {
		const geometry = new THREE.SphereGeometry(Flocker.SIZE, 20, 20);
		const material = new THREE.MeshBasicMaterial({ color:  0xFF00FF });
		const sphere = new THREE.Mesh(geometry, material);

		sphere.position.set(x, y, z);

		return sphere;
	}

	flock(mousePosition) {
		this.mesh.position.set(mousePosition.x, -mousePosition.y, 0);
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

class FlockerGroup {
	constructor(num) {
		this.flockers = Flocker.genX(num);
		this.mousePosition = { x: 0, y: 0 };

		this.setMousePosition = this.setMousePosition.bind(this);
	}

	setMousePosition(event) {
		this.mousePosition = {
			x: event.clientX,
			y: event.clientY,
		};
	}

	addToScene(scene) {
		this.flockers.forEach(flocker => {
			scene.add(flocker.mesh);
		});
	}

	tick() {
		this.flockers.forEach(flocker => flocker.flock(this.mousePosition));
	}

	registerCallbacks() {
		document.onmousemove = this.setMousePosition;
	}
}

function setRendererSize(renderer) {
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCamera() {
	camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
	camera.position.z = 500;
	camera.position.x = window.innerWidth / 2;
	camera.position.y = -window.innerHeight / 2;
}

function render() {
	renderer.render(scene, camera);
}

function loop(flockerGroup) {
	requestAnimationFrame(loop.bind(undefined, flockerGroup));
	render();
	flockerGroup.tick();
}

let camera, scene, renderer;

function main() {
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	setRendererSize(renderer);
	updateCamera();

	document.getElementById('main').appendChild(renderer.domElement);

	window.onresize = () => {
		setRendererSize(renderer);
		updateCamera();
	}

	const flockerGroup = new FlockerGroup(10);
	flockerGroup.registerCallbacks();
	flockerGroup.addToScene(scene);
	loop(flockerGroup);
}

main();

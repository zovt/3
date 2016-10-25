const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color:  0xFF00FF });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function makeCamera() {
	const cam = new THREE.PerspectiveCamera(75, 
		window.innerWidth / window.innerHeight, 0.1, 1000);
	cam.position.z = 5;

	return cam;
}

let camera = makeCamera();
let dx = 0;
let dy = 0;

function render() {
	requestAnimationFrame(render);

	dx = Math.min(10, dx + (Math.random() - 0.5));
	dy = Math.min(10, dy + (Math.random() - 0.5));
	cube.rotation.x += 0.01 * dx;
	cube.rotation.y += 0.01 * dy;
	

	renderer.render(scene, camera);
}

window.onresize = (ev) => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera = makeCamera();
}

document.getElementById('main').appendChild(renderer.domElement);
render();

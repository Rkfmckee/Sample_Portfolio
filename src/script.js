import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

const gui = new dat.GUI();
const world = {
	plane: {
		width: 10,
		height: 10,
		widthSegments: 10,
		heightSegments: 10
	}
};

gui.add(world.plane, 'width', 1, 10).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 10).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 10).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 10).onChange(generatePlane);

function generatePlane() {
	plane.geometry.dispose();
	plane.geometry = new THREE.PlaneGeometry(
		world.plane.width,
		world.plane.height, 
		world.plane.widthSegments,
		world.plane.height
	);

	const {array} = plane.geometry.attributes.position;

	for (let i = 0; i < array.length; i += 3) {
		const x = array[i];
		const y = array[i+1];
		const z = array[i+2];

		array[i+2] = z + Math.random();
	}
}

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

var orbitControls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
	color: 0xFF0000,
	side: THREE.DoubleSide,
	flatShading: true
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const {array} = plane.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
	const x = array[i];
	const y = array[i+1];
	const z = array[i+2];

	array[i+2] = z + Math.random();
}

function createLight(x, y, z) {
	const light = new THREE.DirectionalLight('white', 1)
	light.position.set(x, y, z);
	scene.add(light);
}

createLight(0, 0, 1);
createLight(0, 0, -1);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
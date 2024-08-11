import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

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

const light = new THREE.DirectionalLight('white', 1)
light.position.set(0, 0, 1);
scene.add(light);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
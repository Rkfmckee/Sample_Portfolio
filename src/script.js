import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';

const gui = new dat.GUI();
const world = {
	plane: {
		width: 20,
		height: 10,
		widthSegments: 20,
		heightSegments: 10
	}
};

gui.add(world.plane, 'width', 1, 20).onChange(updatePlaneGeometry);
gui.add(world.plane, 'height', 1, 10).onChange(updatePlaneGeometry);
gui.add(world.plane, 'widthSegments', 1, 20).onChange(updatePlaneGeometry);
gui.add(world.plane, 'heightSegments', 1, 10).onChange(updatePlaneGeometry);

function updatePlaneGeometry() {
	plane.geometry.dispose();
	plane.geometry = generatePlaneGeometry();
	randomizePlaneGeometryZ();
	setPlaneColors();
}

function generatePlaneGeometry() {
	return new THREE.PlaneGeometry(
		world.plane.width,
		world.plane.height, 
		world.plane.widthSegments,
		world.plane.heightSegments
	);
}

function randomizePlaneGeometryZ() {
	const {array} = plane.geometry.attributes.position;

	for (let i = 0; i < array.length; i += 3) {
		const z = array[i+2];

		array[i+2] = z + Math.random();
	}
}

function setPlaneColors() {
	const colors = [];

	for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
		colors.push(0, .19, .4);
	}

	plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
}

const raycaster = new THREE.Raycaster();
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

var orbitControls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const planeGeometry = generatePlaneGeometry();
const planeMaterial = new THREE.MeshPhongMaterial({
	side: THREE.DoubleSide,
	flatShading: true,
	vertexColors: true
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

randomizePlaneGeometryZ();
setPlaneColors();
scene.add(plane);

function createLight(x, y, z) {
	const light = new THREE.DirectionalLight('white', 1)
	light.position.set(x, y, z);
	scene.add(light);
}

createLight(0, 0, 1);
createLight(0, 0, -1);

const mouse = {
	x: undefined,
	y: undefined
};

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObject(plane);

	if (intersects.length > 0) {
		const initialColor = {r: 0, g: .19, b: .4};
		const hoverColor = {r: .1, g: .5, b: 1};

		const {color} = intersects[0].object.geometry.attributes;

		color.setX(intersects[0].face.a, hoverColor.r);
		color.setY(intersects[0].face.a, hoverColor.g);
		color.setZ(intersects[0].face.a, hoverColor.b);
	
		color.setX(intersects[0].face.b, hoverColor.r);
		color.setY(intersects[0].face.b, hoverColor.g);
		color.setZ(intersects[0].face.b, hoverColor.b);
	
		color.setX(intersects[0].face.c, hoverColor.r);
		color.setY(intersects[0].face.c, hoverColor.g);
		color.setZ(intersects[0].face.c, hoverColor.b);
	
		intersects[0].object.geometry.attributes.color.needsUpdate = true;

		gsap.to(hoverColor, {
			r: initialColor.r,
			g: initialColor.g,
			b: initialColor.b,
			duration: 1,
			onUpdate: () => {
				const {color} = intersects[0].object.geometry.attributes;

				color.setX(intersects[0].face.a, hoverColor.r);
				color.setY(intersects[0].face.a, hoverColor.g);
				color.setZ(intersects[0].face.a, hoverColor.b);
			
				color.setX(intersects[0].face.b, hoverColor.r);
				color.setY(intersects[0].face.b, hoverColor.g);
				color.setZ(intersects[0].face.b, hoverColor.b);
			
				color.setX(intersects[0].face.c, hoverColor.r);
				color.setY(intersects[0].face.c, hoverColor.g);
				color.setZ(intersects[0].face.c, hoverColor.b);
			
				intersects[0].object.geometry.attributes.color.needsUpdate = true;
			}
		});
	}
}

// function setVerticesColor(intersects) {
// 	const {color} = intersects[0].object.geometry.attributes;

// 	color.setX(intersects[0].face.a, hoverColor.r);
// 	color.setY(intersects[0].face.a, hoverColor.g);
// 	color.setZ(intersects[0].face.a, hoverColor.b);

// 	color.setX(intersects[0].face.b, hoverColor.r);
// 	color.setY(intersects[0].face.b, hoverColor.g);
// 	color.setZ(intersects[0].face.b, hoverColor.b);

// 	color.setX(intersects[0].face.c, hoverColor.r);
// 	color.setY(intersects[0].face.c, hoverColor.g);
// 	color.setZ(intersects[0].face.c, hoverColor.b);

// 	intersects[0].object.geometry.attributes.color.needsUpdate = true;
// }

animate();

addEventListener('mousemove', (event) => {
	mouse.x = screenToThreePosition(event.clientX, innerWidth);
	mouse.y = -screenToThreePosition(event.clientY, innerHeight);
});

function screenToThreePosition(screenPos, screenDim) {
	// Three.js coordinate system
	// Center = (0, 0)
	// Top right = (1, 1)
	// Bottom left = (-1, -1)

	return ((screenPos / screenDim) * 2) - 1;
}
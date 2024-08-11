import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';

const gui = new dat.GUI();
const world = {
	plane: {
		width: 400,
		height: 400,
		widthSegments: 50,
		heightSegments: 50
	}
};

gui.add(world.plane, 'width', 1, 400).onChange(updatePlaneGeometry);
gui.add(world.plane, 'height', 1, 400).onChange(updatePlaneGeometry);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(updatePlaneGeometry);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(updatePlaneGeometry);

function updatePlaneGeometry() {
	plane.geometry.dispose();
	plane.geometry = generatePlaneGeometry();
	randomizePlaneVertexPositions();
	setPlaneColors();
}

function generatePlaneGeometry() {
	const geometry = new THREE.PlaneGeometry(
		world.plane.width,
		world.plane.height, 
		world.plane.widthSegments,
		world.plane.heightSegments
	);

	geometry.attributes.position.originalPosition = geometry.attributes.position.array;
	geometry.attributes.position.randomValues = randomValues;

	return geometry;
}

const randomValues = [];

function randomizePlaneVertexPositions() {
	const {array} = plane.geometry.attributes.position;

	for (let i = 0; i < array.length; i++) {
		randomValues.push(Math.random() * Math.PI * 2);
		
		if (i % 3 == 0) {
			const x = array[i];
			const y = array[i+1];
			const z = array[i+2];

			array[i] = x + (Math.random() - 0.5) * 5;
			array[i+1] = y + (Math.random() - 0.5) * 5;
			array[i+2] = z + (Math.random() - 0.5) * 5;
		}
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
camera.position.z = 100;
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

randomizePlaneVertexPositions();
setPlaneColors();
scene.add(plane);

function createLight(z) {
	const light = new THREE.DirectionalLight('white', 1)
	light.position.set(0, 1, z);
	scene.add(light);
}

createLight(1);
createLight(-1);

const mouse = {
	x: undefined,
	y: undefined
};

let frame = 0;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	frame += 0.01;

	const {array, originalPosition, randomValues} = plane.geometry.attributes.position;

	for (let i = 0; i < array.length; i += 3) {
		array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * .01;
		array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1]) * .01;
	}

	plane.geometry.attributes.position.needsUpdate = true;

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
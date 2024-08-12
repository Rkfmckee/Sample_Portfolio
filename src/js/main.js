import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';

import * as create from './createObjects'
import * as helpers from './helpers'
import * as planeHelpers from './planeHelpers'

const gui = new dat.GUI();
const world = {
	plane: {
		width: 400,
		height: 400,
		widthSegments: 50,
		heightSegments: 50
	}
};

gui.add(world.plane, 'width', 1, 400).onChange(planeHelpers.updatePlaneGeometry);
gui.add(world.plane, 'height', 1, 400).onChange(planeHelpers.updatePlaneGeometry);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(planeHelpers.updatePlaneGeometry);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(planeHelpers.updatePlaneGeometry);

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const camera = create.camera(scene);
const renderer = create.renderer(canvas);

new OrbitControls(camera, canvas);

const randomValues = [];
const plane = create.plane(world, randomValues);
planeHelpers.randomizeVertexPositions(plane, randomValues);
planeHelpers.setColors(plane);
scene.add(plane);

create.light(1, scene);
create.light(-1, scene);

const mouse = {
	x: undefined,
	y: undefined
};

let frame = 0;
animate();

addEventListener('mousemove', (event) => {
	mouse.x = helpers.screenToThreePosition(event.clientX, innerWidth);
	mouse.y = -helpers.screenToThreePosition(event.clientY, innerHeight);
});

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

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObject(plane);

	if (intersects.length > 0) {
		const initialColor = {r: 0, g: .19, b: .4};
		const hoverColor = {r: .1, g: .5, b: 1};

		planeHelpers.setVertexColors(intersects, hoverColor);

		gsap.to(hoverColor, {
			r: initialColor.r,
			g: initialColor.g,
			b: initialColor.b,
			duration: 1,
			onUpdate: () => planeHelpers.setVertexColors(intersects, hoverColor)
		});
	}
}
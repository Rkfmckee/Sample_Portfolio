import * as THREE from 'three';

export function camera(scene) {
	const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
	camera.position.z = 100;
	scene.add(camera);

	return camera;
}

export function renderer(canvas) {
	const renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(devicePixelRatio);

	return renderer;
}

export function light(zPos, scene) {
	const light = new THREE.DirectionalLight('white', 1)
	light.position.set(0, 1, zPos);
	scene.add(light);

	return light;
}

export function plane(world, randomValues) {
	const geometry = planeGeometry(world, randomValues);

	const planeMaterial = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		flatShading: true,
		vertexColors: true
	});

	return new THREE.Mesh(geometry, planeMaterial);
}

export function planeGeometry(world, randomValues) {
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
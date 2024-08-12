import * as THREE from 'three';

export function randomizeVertexPositions(plane, randomValues) {
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

export function setColors(plane) {
	const colors = [];

	for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
		colors.push(0, .19, .4);
	}

	plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
}

export function setVertexColors(intersects, hoverColor) {
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

export function updatePlaneGeometry(plane) {
	plane.geometry.dispose();
	plane.geometry = create.planeGeometry(world, randomValues);
	
	randomizeVertexPositions(plane, randomValues);
	setColors(plane);
}
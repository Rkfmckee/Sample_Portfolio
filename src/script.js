import * as THREE from 'three'

var canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(innerWidth, innerHeight);
renderer.render(scene, camera);

console.log(scene)
console.log(camera)
console.log(renderer)
/*
 * Creating the scene
 */

import * as THREE from "three";

const WIDTH = window.innerWidth;
const HEIGHT = 800;

const scene = new THREE.Scene();
// Set background color to light gray
// scene.background = new THREE.Color(0xe0e0e0); 

// Load image as texture for the background
const backgroundTextureLoader = new THREE.TextureLoader();
const backgroundTexture = backgroundTextureLoader.load("./textures/background.jpg");
scene.background = backgroundTexture;

const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
const appElement = document.getElementById("app");
appElement.appendChild(renderer.domElement);

// Object (Cube)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// Create a basic material with color and disable transparency
// const material = new THREE.MeshStandardMaterial({ color: 0x8C52FF, transparent: false });

// Load image as texture for the cube
const cubeTextureLoader = new THREE.TextureLoader();
const cubeTexture = cubeTextureLoader.load("./textures/cube.jpg");
const cubeMaterial = new THREE.MeshStandardMaterial({ map: cubeTexture });

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);
cube.castShadow = true; // Enable shadow casting
scene.add(cube);

// Create line segments for each edge of the cube
const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const edges = new THREE.LineSegments(edgesGeometry, lineMaterial);
edges.position.set(0, 1.5, 0);
scene.add(edges);

// Light: Directional Light (like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 4, 10); // Adjust position as needed
directionalLight.castShadow = true; // Enable shadow casting
directionalLight.shadow.mapSize.width = 1024;  // Shadow map width (power of 2)
directionalLight.shadow.mapSize.height = 1024; // Shadow map height (power of 2)
directionalLight.shadow.camera.near = 0.5;      // Near shadow plane
directionalLight.shadow.camera.far = 15;        // Far shadow plane
scene.add(directionalLight);

// Light: Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff); // red light
ambientLight.intensity = 0.5;
scene.add(ambientLight);

// Create a grid helper
const gridHelper = new THREE.GridHelper(25, 25); // Parameters: size, divisions
gridHelper.position.set(0, 0, 0);
scene.add(gridHelper);

// Ground (for shadows to be visible)
const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true; // Enable shadow receiving
scene.add(ground);

renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

// Rendering
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube for a better perspective effect
  cube.rotation.x = 0.25;
  cube.rotation.y = 0.5;

  edges.rotation.x = cube.rotation.x;
  edges.rotation.y = cube.rotation.y;

  renderer.render(scene, camera);
}

animate();


/*
* UI Buttons
*/

// Get a reference to the button element
const uiButton = document.getElementById("uiButton");

// Add a click event listener to the button
uiButton.addEventListener("click", () => {
  // Add any actions you want to perform when the button is clicked
  alert("Button clicked!");
});

/*
* Events
*/

// Add event listener for mouse wheel (zoom)
document.addEventListener("wheel", (event) => {
  // Adjust the camera's position based on the scroll delta
  camera.position.z += event.deltaY * 0.1; // Adjust the factor for desired zoom speed

  // Limit the zoom range if needed
  camera.position.z = Math.max(2, camera.position.z);
  camera.position.z = Math.min(10, camera.position.z);
});
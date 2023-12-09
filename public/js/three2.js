import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const heroSection = document.querySelector("#hero-section");
heroSection.appendChild(renderer.domElement);

let heroSectionWidth = heroSection.clientWidth;
let heroSectionHeight = heroSection.clientHeight;

camera.aspect = heroSectionWidth / heroSectionHeight;
camera.updateProjectionMatrix();

let userInteracting = false;

const loader = new GLTFLoader();
let model;

async function loadModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

loadModel("/scene.gltf")
  .then((gltf) => {
    model = gltf.scene;
    scene.add(gltf.scene);
  })
  .catch((error) => {
    console.error(error);
  });

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

controls.addEventListener("start", function () {
  userInteracting = true;
});

controls.addEventListener("end", function () {
  userInteracting = false;
});

controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 6;
controls.maxAzimuthAngle = Math.PI / 6;

const ambientLight = new THREE.AmbientLight(0xffffff);
const light = new THREE.AmbientLight(0x404040);
scene.add(ambientLight, light);

camera.position.set(0, 1, 5);
controls.update();

let rotationAngle = 0;
const rotationSpeed = 0.002;
const targetRotation = THREE.MathUtils.degToRad(30);
let rotateClockwise = true;

let targetRotationY = 0;
let currentTargetRotationY = 0;

function animate() {
  requestAnimationFrame(animate);

  if (model && !userInteracting) {
    model.position.y = -2;

    if (rotateClockwise && rotationAngle < targetRotation) {
      rotationAngle += rotationSpeed;
    } else if (!rotateClockwise && rotationAngle > -targetRotation) {
      rotationAngle -= rotationSpeed;
    } else {
      rotateClockwise = !rotateClockwise;
      targetRotationY = rotateClockwise ? targetRotation : -targetRotation;
    }

    currentTargetRotationY = THREE.MathUtils.lerp(
      currentTargetRotationY,
      targetRotationY,
      0.01
    );
    model.rotation.y = THREE.MathUtils.lerp(
      model.rotation.y,
      currentTargetRotationY,
      0.01
    );
  }

  controls.update();
  renderer.render(scene, camera);
}

function updateCameraPosition() {
  let aspectRatio = heroSectionWidth / heroSectionHeight;

  if (aspectRatio < 1) {
    camera.position.set(0, 1, 5 / aspectRatio);
  } else {
    camera.position.set(0, 1, 5);
  }

  camera.updateProjectionMatrix();
  controls.update();
}

animate();

window.addEventListener("resize", function () {
  heroSectionWidth = heroSection.clientWidth;
  heroSectionHeight = heroSection.clientHeight;

  renderer.setSize(heroSectionWidth, heroSectionHeight);

  camera.aspect = heroSectionWidth / heroSectionHeight;
  updateCameraPosition();
});

updateCameraPosition();

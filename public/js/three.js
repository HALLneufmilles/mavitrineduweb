import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const heroSection = document.querySelector("#hero-section");
heroSection.appendChild(renderer.domElement);

let userInteracting = false;

// Importation du model 3D
const loader = new GLTFLoader();
// s'est mieux de charger le 3D de manière asynchrone car c'est un fichier lourd
async function loadModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

let model;

loadModel("./scene.gltf")
  .then((gltf) => {
    model = gltf.scene;
    scene.add(gltf.scene);
  })
  .catch((error) => {
    console.error(error);
  });

// loader.load(
//   "./scene.gltf",
//   function (gltf) {
//     model = gltf.scene;

//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

//Control des mouvements
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

controls.addEventListener("start", function () {
  userInteracting = true;
});

controls.addEventListener("end", function () {
  userInteracting = false;
});

// Angle vertical:
controls.minPolarAngle = 0; // 0 degrés
controls.maxPolarAngle = Math.PI / 2; // 90 degrés

// Pour l'azimute de -30° à +30° (horizontal):
controls.minAzimuthAngle = -Math.PI / 6; // -30 degrés
controls.maxAzimuthAngle = Math.PI / 6; // 30 degrés

// deux ambiences
const ambientLight = new THREE.AmbientLight(0xffffff);
const light = new THREE.AmbientLight(0x404040);
scene.add(ambientLight, light);

// position de la camera
camera.position.set(0, 1, 5);
// camera.position.set(0, 4, 8);
controls.update();
// pour avoir les rendus en permanence (Boucle de rendu --> Voir créer une scene de la doc threeJS)

let rotationAngle = 0;
const rotationSpeed = 0.002;
const targetRotation = THREE.MathUtils.degToRad(30);
let rotateClockwise = true;

let targetRotationY = 0;
let currentTargetRotationY = 0; // Une nouvelle variable pour garder la trace de la progression vers la nouvelle valeur de targetRotationY

// function animate() {
//   requestAnimationFrame(animate);

//   if (model) {
//     model.position.y = -2;

//     if (rotateClockwise && rotationAngle < targetRotation) {
//       rotationAngle += rotationSpeed;
//     } else if (!rotateClockwise && rotationAngle > -targetRotation) {
//       rotationAngle -= rotationSpeed;
//     } else {
//       rotateClockwise = !rotateClockwise;
//       targetRotationY = rotateClockwise ? targetRotation : -targetRotation;
//     }

//     // Utilisez lerp pour progresser doucement vers la nouvelle valeur de targetRotationY
//     currentTargetRotationY = THREE.MathUtils.lerp(currentTargetRotationY, targetRotationY, 0.01);

//     // Utilisez lerp pour effectuer une rotation douce vers currentTargetRotationY
//     model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, currentTargetRotationY, 0.01);
//   }

//   controls.update();
//   renderer.render(scene, camera);
// }

// animate();

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

    // Utilisez lerp pour progresser doucement vers la nouvelle valeur de targetRotationY
    currentTargetRotationY = THREE.MathUtils.lerp(currentTargetRotationY, targetRotationY, 0.01);

    // Utilisez lerp pour effectuer une rotation douce vers currentTargetRotationY
    model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, currentTargetRotationY, 0.01);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
window.addEventListener("resize", function () {
  // Met à jour la taille du renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Met à jour l'aspect de la caméra
  camera.aspect = window.innerWidth / window.innerHeight;

  // Appelle la méthode updateProjectionMatrix sur la caméra
  camera.updateProjectionMatrix();
});

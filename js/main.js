var THREE = require("three");

window.addEventListener("load", init, false);

let Colors = {
  white: 0xfaf9f9,
  green: 0xbee3db,
};

window.addEventListener("load", init, false);

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects
  createBox();
  createPlane();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();
}

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  container;

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Create the renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xebebeb, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 0.1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.y = 200;
  camera.position.z = 300;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener("resize", handleWindowResize, false);
}

//Lights

let hemisphereLight, shadowLight, light2, light3;
function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);

  shadowLight = new THREE.DirectionalLight(Colors.white, 0.4);
  shadowLight.position.set(0, 450, 350);
  shadowLight.castShadow = true;

  shadowLight.shadow.camera.left = -650;
  shadowLight.shadow.camera.right = 650;
  shadowLight.shadow.camera.top = 650;
  shadowLight.shadow.camera.bottom = -650;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;

  light2 = new THREE.DirectionalLight(Colors.white, 0.25);
  light2.position.set(-600, 350, 350);

  light3 = new THREE.DirectionalLight(Colors.white, 0.15);
  light3.position.set(0, -250, 300);

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(light2);
  scene.add(light3);
}

//Objects
let box;
function createBox() {
  boxGeometry = new THREE.BoxGeometry(150, 30, 60);

  boxMaterial = new THREE.MeshStandardMaterial({
    color: Colors.green,
    roughness: 0.61,
    metalness: 0.21,
    side: THREE.FrontSide,
  });
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;
  box.receiveShadow = false;
  scene.add(box);
}

function createPlane() {
  const planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
  const planeMaterial = new THREE.ShadowMaterial({
    opacity: 0.15,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -30;
  plane.position.x = 0;
  plane.position.z = 0;
  plane.rotation.x = (Math.PI / 180) * -90;
  plane.receiveShadow = true;
  scene.add(plane);
}

function loop() {
  // render the scene
  renderer.render(scene, camera);

  // call the loop function again
  requestAnimationFrame(loop);
}

//Utilities

//As the screen size can change, we need to update the renderer size and the camera aspect ratio
function handleWindowResize() {
  // update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

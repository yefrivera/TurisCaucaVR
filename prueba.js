import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';

// Crear la escena, cámara y renderizador
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 1);  // Posicionar la cámara en el centro de la esfera

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Configurar controles de cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;
controls.target.set(0, 0, 0);  // Asegurar que la cámara mire al centro de la escena

// Cargar texturas panorámicas y crear esferas
const textureLoader = new THREE.TextureLoader();
const panoramas = [];
const panoramaImages = [
    './images/centrocaldas.jpg', './images/catedral.jpg', './images/bancolombia.jpg',
    './images/bancobogota.jpg', './images/juanvaldez.jpg', './images/catt.jpg',
    './images/reloj.jpg', './images/esq-b.jpg', './images/esq-bb.jpg',
    './images/esq-c.jpg', './images/humilladero1.jpg'
];

panoramaImages.forEach((image, index) => {
    textureLoader.load(image, (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = `panorama${index + 1}`;
        sphere.visible = false;
        panoramas.push(sphere);
        scene.add(sphere);

        // Configurar enlaces entre panoramas
        if (index === 0) {
            sphere.visible = true;
        }
    });
});

// Función para cambiar de panorama
function setPanorama(index) {
    panoramas.forEach((panorama, i) => {
        panorama.visible = i === index;
    });
}

// Configurar los enlaces entre panoramas (links)
const links = [
    { from: 0, to: 1, position: new THREE.Vector3(-800, -1500, 6000) },
    { from: 0, to: 2, position: new THREE.Vector3(-6000, -1500, -190) },
    // Agrega todos los enlaces necesarios aquí
];

links.forEach(link => {
    if (panoramas[link.from]) {
        const linkGeometry = new THREE.PlaneGeometry(500, 500);
        const linkMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
        const linkMesh = new THREE.Mesh(linkGeometry, linkMaterial);
        linkMesh.position.copy(link.position);
        linkMesh.userData.toPanorama = link.to;
        panoramas[link.from].add(linkMesh);
    }
});

// Crear los puntos de interés (infospots)
function createInfospot(text, position) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: textureLoader.load('images/pop.jpg') });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(300, 300, 1);
    sprite.userData.text = text;
    return sprite;
}

const infospots = [
    createInfospot('Descripción del punto de interés', new THREE.Vector3(5000, 2000, 0)),
    createInfospot('Descripción del punto de interés', new THREE.Vector3(5000, 2000, 0)),
    createInfospot('Descripción del punto de interés', new THREE.Vector3(5000, 2000, 0))
];

infospots.forEach((infospot, index) => {
    if (panoramas[index]) {
        panoramas[index].add(infospot);
    }
});

// Añadir botón de VR
document.body.appendChild(VRButton.createButton(renderer));

// Configurar el visor para VR
renderer.xr.enabled = true;

// Configurar los controladores de VR
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);

scene.add(controller1);
scene.add(controller2);

const controllerModelFactory = new XRControllerModelFactory();

const controllerGrip1 = renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
scene.add(controllerGrip1);

const controllerGrip2 = renderer.xr.getControllerGrip(1);
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
scene.add(controllerGrip2);

const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();
const intersections = [];

// Función para manejar las intersecciones y acciones de clic
function handleController(controller) {
    if (controller.matrixWorld) {
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
        
        intersections.length = 0;
        raycaster.intersectObjects(scene.children, true, intersections);

        if (intersections.length > 0) {
            const intersection = intersections[0];
            const object = intersection.object;

            if (controller.userData.isSelecting) {
                if (object.userData.toPanorama !== undefined) {
                    setPanorama(object.userData.toPanorama);
                }
            }
        }
    }
}

// Configurar eventos para los controladores
controller1.addEventListener('selectstart', () => controller1.userData.isSelecting = true);
controller1.addEventListener('selectend', () => controller1.userData.isSelecting = false);

controller2.addEventListener('selectstart', () => controller2.userData.isSelecting = true);
controller2.addEventListener('selectend', () => controller2.userData.isSelecting = false);

// Actualizar el tween en el loop de renderizado
function animate() {
    renderer.setAnimationLoop(() => {
        handleController(controller1);
        handleController(controller2);
        controls.update();  // Asegurar que los controles se actualizan en cada frame
        renderer.render(scene, camera);
    });
}

// Iniciar la animación
animate();

// Ajustar el tamaño al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import TWEEN from '@tweenjs/tween.js';

// Escena, cámara y renderizador
const container = document.getElementById('container');
const scenes = [];
for (let i = 0; i < 11; i++) {
    scenes.push(new THREE.Scene());
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace; // Configurar el espacio de color correctamente
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Añadir luz ambiental
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1); // Puedes ajustar la intensidad
scenes.forEach(scene => scene.add(ambientLight));

// Añadir luz direccional (opcional)
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1); // Puedes ajustar la intensidad
directionalLight.position.set(0, 10, 0); // Ajusta la posición según sea necesario
scenes.forEach(scene => scene.add(directionalLight));

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

controls.enableZoom = true;  // Habilitar el zoom
controls.zoomSpeed = 0.3;    // Ajustar la velocidad del zoom
controls.enablePan = false;
camera.position.set(0, 0, 0.1);

// Cargar texturas equirectangulares
const textureLoader = new THREE.TextureLoader();
const texturePaths = [
    'images/centrocaldas.jpg', 'images/catedral.jpg', 'images/bancolombia.jpg',
    'images/bancobogota.jpg', 'images/juanvaldez.jpg', 'images/catt.jpg',
    'images/reloj.jpg', 'images/esq-b.jpg', 'images/esq-bb.jpg',
    'images/esq-c.jpg', 'images/humilladero1.jpg'
];
const textures = new Array(texturePaths.length);

let texturesLoaded = 0;

texturePaths.forEach((path, index) => {
    textureLoader.load(path, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace; // Asegúrate de usar el espacio de color correcto
        textures[index] = texture;
        texturesLoaded++;
        if (texturesLoaded === texturePaths.length) {
            init();
        }
    });
});

function init() {
    // Crear esferas para cada escena
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invertir la esfera para mirar hacia dentro

    textures.forEach((texture, index) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scenes[index].add(sphere);
    });

    // Establecer la escena inicial
    let currentSceneIndex = 0;
    let currentScene = scenes[currentSceneIndex];
    renderer.render(currentScene, camera);

    // Función para cambiar de escena con transición de smooth camera zoom in
    function changeScene(targetSceneIndex) {
        console.log(`Cambiando a la escena: ${targetSceneIndex}`);
        new TWEEN.Tween(camera.position)
            .to({ z: 0.01 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                currentSceneIndex = targetSceneIndex;
                currentScene = scenes[currentSceneIndex];
                updateVRControllers();
                new TWEEN.Tween(camera.position)
                    .to({ z: 0.1 }, 2000)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .start();
            })
            .start();
    }

    // Crear las flechas de navegación
    const arrowTexture = textureLoader.load('images/next.png');

    function createArrow(position, targetSceneIndex) {
        const spriteMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(30, 30, 5);
        sprite.userData = { targetSceneIndex };
        sprite.material.depthTest = false; // Para evitar la deformación
        sprite.material.depthWrite = false;
        return sprite;
    }

    // Enlazar escenas con flechas
    scenes[0].add(createArrow(new THREE.Vector3(32, -130, 480), 1));
    scenes[0].add(createArrow(new THREE.Vector3(484, -120, -16), 2));
    scenes[0].add(createArrow(new THREE.Vector3(-3, -150, -480), 3));
    scenes[0].add(createArrow(new THREE.Vector3(-477, -65, 130), 4));

    scenes[1].add(createArrow(new THREE.Vector3(453, -135, -157), 0));
    scenes[1].add(createArrow(new THREE.Vector3(185, -94, 453), 9));
    scenes[1].add(createArrow(new THREE.Vector3(-142, -91, -470), 6));
    scenes[1].add(createArrow(new THREE.Vector3(-462, -76, 171), 5));

    scenes[2].add(createArrow(new THREE.Vector3(-443, -150, 173), 0));
    scenes[2].add(createArrow(new THREE.Vector3(144, -122, 462), 9));
    scenes[2].add(createArrow(new THREE.Vector3(-111, -85, -479), 8));

    scenes[3].add(createArrow(new THREE.Vector3(-465, -141, 113), 0));
    scenes[3].add(createArrow(new THREE.Vector3(75, -124, 477), 8));
    scenes[3].add(createArrow(new THREE.Vector3(-137, -109, -467), 7));

    scenes[4].add(createArrow(new THREE.Vector3(-480, -130, -24), 0));
    scenes[4].add(createArrow(new THREE.Vector3(-20, -105, -487), 6));
    scenes[4].add(createArrow(new THREE.Vector3(-68, -100, 484), 7));

    scenes[5].add(createArrow(new THREE.Vector3(469, -161, 56), 1));

    scenes[6].add(createArrow(new THREE.Vector3(-305, -114, -377), 1));
    scenes[6].add(createArrow(new THREE.Vector3(-244, -126, 416), 4));

    scenes[7].add(createArrow(new THREE.Vector3(-255, -82, 421), 3));
    scenes[7].add(createArrow(new THREE.Vector3(-388, -87, -301), 4));

    scenes[8].add(createArrow(new THREE.Vector3(-273, -97, 405), 2));
    scenes[8].add(createArrow(new THREE.Vector3(-385, -78, -307), 3));
    scenes[8].add(createArrow(new THREE.Vector3(431, -112, -223), 10));

    scenes[9].add(createArrow(new THREE.Vector3(-91, -125, 474), 1));
    scenes[9].add(createArrow(new THREE.Vector3(-421, -96, -250), 2));

    scenes[10].add(createArrow(new THREE.Vector3(88, -145, 469), 2));

    // Raycaster para detectar clics en las flechas
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        // Filtrar solo los sprites de flecha
        const clickableObjects = currentScene.children.filter(child => child instanceof THREE.Sprite);

        const intersects = raycaster.intersectObjects(clickableObjects, true);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            console.log('Intersección detectada:', intersectedObject);
            if (intersectedObject.userData.targetSceneIndex !== undefined) {
                changeScene(intersectedObject.userData.targetSceneIndex);
            }
        }
    }

    window.addEventListener('click', onMouseClick, false);

    // Controladores de VR
    const controllerModelFactory = new XRControllerModelFactory();

    const controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);

    const controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);

    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));

    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));

    // Crear rayos para los controladores
    const geometry1 = new THREE.BufferGeometry();
    geometry1.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const line1 = new THREE.Line(geometry1, lineMaterial);
    controller1.add(line1);

    const line2 = new THREE.Line(geometry1, lineMaterial);
    controller2.add(line2);

    function updateVRControllers() {
        // Eliminar controladores de la escena anterior
        currentScene.children = currentScene.children.filter(child => child.type !== 'Group');

        // Agregar controladores a la escena actual
        currentScene.add(controller1);
        currentScene.add(controller2);
        currentScene.add(controllerGrip1);
        currentScene.add(controllerGrip2);
    }

    function onSelectStart(event) {
        const controller = event.target;
        const intersections = getIntersections(controller);
        if (intersections.length > 0) {
            const intersection = intersections[0];
            const object = intersection.object;
            if (object.userData.targetSceneIndex !== undefined) {
                changeScene(object.userData.targetSceneIndex);
            }
        }
    }

    function onSelectEnd(event) {
        // Aquí puedes agregar lógica adicional para cuando termine la selección
    }

    function getIntersections(controller) {
        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
        return raycaster.intersectObjects(currentScene.children, true);
    }

    // Manejo del zoom con rueda del ratón
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 3;

    function onDocumentMouseWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            camera.zoom = Math.min(MAX_ZOOM, camera.zoom + 0.1);
        } else {
            camera.zoom = Math.max(MIN_ZOOM, camera.zoom - 0.1);
        }
        camera.updateProjectionMatrix();
    }

    renderer.domElement.addEventListener('wheel', onDocumentMouseWheel, false);

    // Manejo del zoom con gestos de pinza en dispositivos táctiles
    let isPinching = false;
    let initialPinchDistance = 0;
    let initialZoom = 1;

    function onTouchStart(event) {
        if (event.touches.length === 2) {
            isPinching = true;
            initialPinchDistance = getPinchDistance(event);
            initialZoom = camera.zoom;
        }
    }

    function onTouchMove(event) {
        if (isPinching && event.touches.length === 2) {
            const newPinchDistance = getPinchDistance(event);
            const zoomFactor = newPinchDistance / initialPinchDistance;
            camera.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, initialZoom * zoomFactor));
            camera.updateProjectionMatrix();
        }
    }

    function onTouchEnd(event) {
        if (event.touches.length < 2) {
            isPinching = false;
        }
    }

    function getPinchDistance(event) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    renderer.domElement.addEventListener('touchstart', onTouchStart, false);
    renderer.domElement.addEventListener('touchmove', onTouchMove, false);
    renderer.domElement.addEventListener('touchend', onTouchEnd, false);

    // Animación
    function animate() {
        controls.update();
        TWEEN.update();
        renderer.render(currentScene, camera);
    }
    renderer.setAnimationLoop(animate);

    // Ajustar la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/webxr/XRControllerModelFactory.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';


const container = document.getElementById('container');
const scenes = [];
for (let i = 0; i < 11; i++) {
    scenes.push(new THREE.Scene());
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

controls.enableZoom = true;  
controls.zoomSpeed = 0.3;    
controls.enablePan = false;
camera.position.set(0, 0, 0.1);


const textureLoader = new THREE.TextureLoader();
const texturePaths = [
    'images/centrocaldas.jpg', 'images/catedral.jpg', 'images/bancolombia.jpg',
    'images/bancobogota.jpg', 'images/juanvaldez.jpg', 'images/catt.jpg'
];
const textures = new Array(texturePaths.length);

let texturesLoaded = 0;

texturePaths.forEach((path, index) => {
    textureLoader.load(path, (texture) => {
        textures[index] = texture;
        texturesLoaded++;
        if (texturesLoaded === texturePaths.length) {
            init();
        }
    });
});

function init() {
   
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); 

    textures.forEach((texture, index) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scenes[index].add(sphere);
    });

    let currentSceneIndex = 0;
    let currentScene = scenes[currentSceneIndex];
    renderer.render(currentScene, camera);

    
    function changeScene(targetSceneIndex) {
        console.log(`Cambiando a la escena: ${targetSceneIndex}`);
        new TWEEN.Tween(camera.position)
            .to({ z: 0.01 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                currentSceneIndex = targetSceneIndex;
                currentScene = scenes[currentSceneIndex];
                updateVRControllers();
                new TWEEN.Tween(camera.position)
                    .to({ z: 0.1 }, 1000)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .start();
            })
            .start();
    }

    
    const arrowTexture = textureLoader.load('images/next.png');

    function createArrow(position, targetSceneIndex) {
        const spriteMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(20, 20, 1);
        sprite.userData = { targetSceneIndex };
        sprite.material.depthTest = false; 
        sprite.material.depthWrite = false;
        return sprite;
    }

    scenes[0].add(createArrow(new THREE.Vector3(32, -130, 480), 1));
    scenes[0].add(createArrow(new THREE.Vector3(484, -120, -16), 2));
    scenes[0].add(createArrow(new THREE.Vector3(-3, -150, -480), 3));
    scenes[0].add(createArrow(new THREE.Vector3(-477, -65, 130), 4));

    scenes[1].add(createArrow(new THREE.Vector3(453, -135, -157), 0));
    scenes[1].add(createArrow(new THREE.Vector3(185, -94, 453), 2));
    scenes[1].add(createArrow(new THREE.Vector3(-142, -91, -470), 4));
    scenes[1].add(createArrow(new THREE.Vector3(-462, -76, 171), 5));

    scenes[2].add(createArrow(new THREE.Vector3(-443, -150, 173), 0));
    scenes[2].add(createArrow(new THREE.Vector3(144, -122, 462), 1));
    scenes[2].add(createArrow(new THREE.Vector3(-111, -85, -479), 3));

    scenes[3].add(createArrow(new THREE.Vector3(-465, -141, 113), 0));
    scenes[3].add(createArrow(new THREE.Vector3(75, -124, 477), 2));
    scenes[3].add(createArrow(new THREE.Vector3(-137, -109, -467), 4));

    scenes[4].add(createArrow(new THREE.Vector3(-480, -130, -24), 0));
    scenes[4].add(createArrow(new THREE.Vector3(-20, -105, -487), 1));
    scenes[4].add(createArrow(new THREE.Vector3(-68, -100, 484), 3));

    scenes[5].add(createArrow(new THREE.Vector3(469, -161, 56), 1));


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

       
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

    
    const geometry1 = new THREE.BufferGeometry();
    geometry1.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const line1 = new THREE.Line(geometry1, lineMaterial);
    controller1.add(line1);

    const line2 = new THREE.Line(geometry1, lineMaterial);
    controller2.add(line2);

    function updateVRControllers() {
        
        currentScene.children = currentScene.children.filter(child => child.type !== 'Group');

       
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
        
    }

    function getIntersections(controller) {
        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
        return raycaster.intersectObjects(currentScene.children, true);
    }

    
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 2;

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

    
    function animate() {
        controls.update();
        TWEEN.update();
        renderer.render(currentScene, camera);
    }
    renderer.setAnimationLoop(animate);

    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
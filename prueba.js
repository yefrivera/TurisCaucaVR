import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/controls/OrbitControls.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js';

// Escena, cámara y renderizador
const container = document.getElementById('container');
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();
const scene5 = new THREE.Scene();
const scene6 = new THREE.Scene();
const scene7 = new THREE.Scene();
const scene8 = new THREE.Scene();
const scene9 = new THREE.Scene();
const scene10 = new THREE.Scene();
const scene11 = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
camera.position.set(0, 0, 0.1);

// Cargar texturas equirectangulares
const textureLoader = new THREE.TextureLoader();
const texture1 = textureLoader.load('images/centrocaldas.jpg', onLoad);
const texture2 = textureLoader.load('images/catedral.jpg', onLoad);
const texture3 = textureLoader.load('images/bancolombia.jpg', onLoad);
const texture4 = textureLoader.load('images/bancobogota.jpg', onLoad);
const texture5 = textureLoader.load('images/juanvaldez.jpg', onLoad);
const texture6 = textureLoader.load('images/catt.jpg', onLoad);

let texturesLoaded = 0;

function onLoad() {
    texturesLoaded++;
    if (texturesLoaded === 11) {
        init();
    }
}

function init() {
    // Crear esferas para cada escena
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invertir la esfera para mirar hacia dentro

    const createSphere = (texture) => {
        return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    }

    const sphere1 = createSphere(texture1);
    const sphere2 = createSphere(texture2);
    const sphere3 = createSphere(texture3);
    const sphere4 = createSphere(texture4);
    const sphere5 = createSphere(texture5);
    const sphere6 = createSphere(texture6);


    scene1.add(sphere1);
    scene2.add(sphere2);
    scene3.add(sphere3);
    scene4.add(sphere4);
    scene5.add(sphere5);
    scene6.add(sphere6);


    // Función para cambiar de escena con transición de zoom-in
    let currentScene = scene1;
    function changeScene(scene) {
        new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 0, z: 0.01 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                currentScene = scene;
                new TWEEN.Tween(camera.position)
                    .to({ x: 0, y: 0, z: 0.1 }, 500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .start();
            })
            .start();
    }

    // Crear las flechas de navegación
    const arrowTexture = textureLoader.load('images/next.png');

    function createArrow(position, targetScene) {
        const spriteMaterial = new THREE.SpriteMaterial({ map: arrowTexture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(50, 50, 1);
        sprite.userData = { targetScene };
        return sprite;
    }

    // Enlazar escenas con flechas
    scene1.add(createArrow(new THREE.Vector3(-800, -1500, 6000), scene2));
    scene1.add(createArrow(new THREE.Vector3(-6000, -1500, -190), scene3));
    scene1.add(createArrow(new THREE.Vector3(0, -1800, -6000), scene4));
    scene1.add(createArrow(new THREE.Vector3(6000, -800, 1600), scene5));

    scene2.add(createArrow(new THREE.Vector3(-6200, -1800, -2000), scene1));
    scene2.add(createArrow(new THREE.Vector3(-2400, -1000, 6000), scene3));
    scene2.add(createArrow(new THREE.Vector3(1500, -1000, -5000), scene5));
    scene2.add(createArrow(new THREE.Vector3(7200, -1000, 2550), scene6));

    scene3.add(createArrow(new THREE.Vector3(6000, -1800, 2300), scene1));
    scene3.add(createArrow(new THREE.Vector3(-1500, -750, 6000), scene2));
    scene3.add(createArrow(new THREE.Vector3(1500, -1000, -7000), scene4));

    scene4.add(createArrow(new THREE.Vector3(6000, -1000, 1400), scene1));
    scene4.add(createArrow(new THREE.Vector3(-1000, -1000, 6000), scene3));
    scene4.add(createArrow(new THREE.Vector3(2000, -1000, -7000), scene5));

    scene5.add(createArrow(new THREE.Vector3(5000, -1000, -400), scene1));
    scene5.add(createArrow(new THREE.Vector3(0, -1000, -6500), scene2));
    scene5.add(createArrow(new THREE.Vector3(1200, -1000, 6000), scene4));

    scene6.add(createArrow(new THREE.Vector3(-7200, -2000, 850), scene2));


    // Raycaster para detectar clics en las flechas
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(currentScene.children, true);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject.userData.targetScene) {
                changeScene(intersectedObject.userData.targetScene);
            } else {
                // Obtener las coordenadas del punto de clic
                console.log('Clicked coordinates:', intersects[0].point);
            }
        }
    }

    window.addEventListener('click', onMouseClick, false);

    // Expansión del botón cuando el mouse pasa por encima
    function onMouseOver(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(currentScene.children, true);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject.userData.targetScene) {
                new TWEEN.Tween(intersectedObject.scale)
                    .to({ x: 75, y: 75, z: 1 }, 200)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            }
        }
    }

    function onMouseOut(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(currentScene.children, true);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject.userData.targetScene) {
                new TWEEN.Tween(intersectedObject.scale)
                    .to({ x: 50, y: 50, z: 1 }, 200)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            }
        }
    }

    window.addEventListener('mousemove', onMouseOver, false);
    window.addEventListener('mouseout', onMouseOut, false);

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        TWEEN.update();
        renderer.render(currentScene, camera);
    }
    animate();

    // Ajustar la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

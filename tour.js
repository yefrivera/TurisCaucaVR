import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { VRButton } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.159.0/examples/jsm/webxr/XRControllerModelFactory.js';

// Crear una nueva escena de Panolens
const viewer = new PANOLENS.Viewer({
    container: document.querySelector('#container'),
    autoHideControlBar: false,
    controlBar: true,
    controlButtons: ['fullscreen', 'setting']
});

// Crear imágenes panorámicas
const panorama1 = new PANOLENS.ImagePanorama('./images/centrocaldas.jpg');
const panorama2 = new PANOLENS.ImagePanorama('./images/catedral.jpg');
const panorama3 = new PANOLENS.ImagePanorama('./images/bancolombia.jpg');
const panorama4 = new PANOLENS.ImagePanorama('./images/bancobogota.jpg');
const panorama5 = new PANOLENS.ImagePanorama('./images/juanvaldez.jpg');
const panorama6 = new PANOLENS.ImagePanorama('./images/catt.jpg');

const panorama7 = new PANOLENS.ImagePanorama('./images/reloj.jpg');
const panorama8 = new PANOLENS.ImagePanorama('./images/esq-b.jpg');
const panorama9 = new PANOLENS.ImagePanorama('./images/esq-bb.jpg');
const panorama10 = new PANOLENS.ImagePanorama('./images/esq-c.jpg');

const panorama11 = new PANOLENS.ImagePanorama('./images/humilladero1.jpg');

// Enlazar panoramas
panorama1.link(panorama2, new THREE.Vector3(-800, -1500, 6000));
panorama1.link(panorama3, new THREE.Vector3(-6000, -1500, -190));
panorama1.link(panorama4, new THREE.Vector3(0, -1800, -6000));
panorama1.link(panorama5, new THREE.Vector3(6000, -800, 1600));

panorama2.link(panorama1, new THREE.Vector3(-6200, -1800, -2000));
panorama2.link(panorama10, new THREE.Vector3(-2400, -1000, 6000));
panorama2.link(panorama7, new THREE.Vector3(1500, -1000, -5000));
panorama2.link(panorama6, new THREE.Vector3(7200, -1000, 2550));

panorama3.link(panorama1, new THREE.Vector3(6000, -1800, 2300));
panorama3.link(panorama10, new THREE.Vector3(-1500, -750, 6000));
panorama3.link(panorama9, new THREE.Vector3(1500, -1000, -7000));

panorama4.link(panorama1, new THREE.Vector3(6000, -1000, 1400));
panorama4.link(panorama9, new THREE.Vector3(-1000, -1000, 6000));
panorama4.link(panorama8, new THREE.Vector3(2000, -1000, -7000));

panorama5.link(panorama1, new THREE.Vector3(5000, -1000, -400));
panorama5.link(panorama7, new THREE.Vector3(0, -1000, -6500));
panorama5.link(panorama8, new THREE.Vector3(1200, -1000, 6000));

panorama7.link(panorama2, new THREE.Vector3(4000, -1000, -6000));
panorama7.link(panorama5, new THREE.Vector3(3900, -1000, 6000));

panorama6.link(panorama2, new THREE.Vector3(-7200, -2000, 850));

panorama8.link(panorama4, new THREE.Vector3(3450, -1000, 5000));
panorama8.link(panorama5, new THREE.Vector3(5500, -1000, -4400));

panorama9.link(panorama3, new THREE.Vector3(3500, -1000, 5000));
panorama9.link(panorama4, new THREE.Vector3(5300, -1000, -4000));
panorama9.link(panorama11, new THREE.Vector3(-5500, -1400, -3000));

panorama10.link(panorama2, new THREE.Vector3(1100, -1000, 6000));
panorama10.link(panorama3, new THREE.Vector3(5800, -1000, -3500));

panorama11.link(panorama3, new THREE.Vector3(-1300, -1500, 6000));

// Agregar panoramas al visor
viewer.add(panorama1, panorama2, panorama3, panorama4, panorama5, panorama6);
viewer.add(panorama7, panorama8, panorama9, panorama10, panorama11);
// Iniciar con el primer panorama
viewer.setPanorama(panorama1);

// Crear puntos de interés en los panoramas
const infospot1 = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
infospot1.position.set(5000, 2000, 0);
infospot1.addHoverText('Descripción del punto de interés');
panorama1.add(infospot1);

const infospot2 = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
infospot2.position.set(5000, 2000, 0);
infospot2.addHoverText('Descripción del punto de interés');
panorama2.add(infospot2);

const infospot3 = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
infospot3.position.set(5000, 2000, 0);
infospot3.addHoverText('Descripción del punto de interés');
panorama3.add(infospot3);

// Añadir botón de VR
document.body.appendChild(VRButton.createButton(viewer.renderer));

// Configurar el visor para VR
viewer.renderer.xr.enabled = true;

// Configurar los controladores de VR
const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const controller1 = viewer.renderer.xr.getController(0);
controller1.add(new THREE.Line(geometry, lineMaterial));
viewer.scene.add(controller1);

const controller2 = viewer.renderer.xr.getController(1);
controller2.add(new THREE.Line(geometry, lineMaterial));
viewer.scene.add(controller2);

const controllerModelFactory = new XRControllerModelFactory();

const controllerGrip1 = viewer.renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
viewer.scene.add(controllerGrip1);

const controllerGrip2 = viewer.renderer.xr.getControllerGrip(1);
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
viewer.scene.add(controllerGrip2);

const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();
const intersected = [];
const intersections = [];

// Establecer la cámara del Raycaster
raycaster.camera = viewer.camera;

// Función para manejar las intersecciones y acciones de clic
function handleController(controller) {
    if (controller.matrixWorld) {
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
        
        intersections.length = 0;
        raycaster.intersectObjects(viewer.scene.children, true, intersections);

        if (intersections.length > 0) {
            const intersection = intersections[0];
            const object = intersection.object;

            if (controller.userData.isSelecting) {
                // Aquí puedes manejar la lógica de clic en el objeto
                console.log('Objeto seleccionado:', object);
                if (object.userData && object.userData.onClick) {
                    object.userData.onClick();
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
    viewer.renderer.setAnimationLoop(() => {
        TWEEN.update();
        handleController(controller1);
        handleController(controller2);
        viewer.render();
    });
}

// Iniciar la animación
animate();

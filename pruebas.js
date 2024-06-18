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

// Crear enlaces entre panoramas
panorama1.link(panorama3, new THREE.Vector3(-6000, -1500, -190));
panorama3.link(panorama1, new THREE.Vector3(6000, -1800, 2300));

panorama1.link(panorama2, new THREE.Vector3(-800, -1500, 6000));
panorama2.link(panorama1, new THREE.Vector3(-6200, -1800, -2000));

panorama1.link(panorama4, new THREE.Vector3(0, -1500, -5000));
panorama4.link(panorama1, new THREE.Vector3(6000, -1000, 1400));

panorama1.link(panorama5, new THREE.Vector3(5000, -700, 1350));
panorama5.link(panorama1, new THREE.Vector3(5000, -1000, -400));

// Función para realizar la transición con zoom-in
function transitionTo(panorama) {
    const initialPosition = viewer.camera.position.clone();
    const zoomIn = new TWEEN.Tween(viewer.camera.position)
        .to({ z: initialPosition.z - 1000 }, 1000) // Zoom-in durante 1 segundo
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            viewer.setPanorama(panorama); // Cambiar al siguiente panorama
            viewer.camera.position.copy(initialPosition); // Resetear la posición de la cámara
            zoomOut.start(); // Comenzar el zoom-out
        });

    const zoomOut = new TWEEN.Tween(viewer.camera.position)
        .to({ z: initialPosition.z }, 1000) // Zoom-out durante 1 segundo
        .easing(TWEEN.Easing.Quadratic.InOut);

    zoomIn.start(); // Comenzar el zoom-in
}

// Agregar eventos de transición para cada enlace
panorama1.addEventListener('link', function(event) { transitionTo(event.detail.target); });
panorama2.addEventListener('link', function(event) { transitionTo(event.detail.target); });
panorama3.addEventListener('link', function(event) { transitionTo(event.detail.target); });
panorama4.addEventListener('link', function(event) { transitionTo(event.detail.target); });
panorama5.addEventListener('link', function(event) { transitionTo(event.detail.target); });

// Agregar panoramas al visor
viewer.add(panorama1, panorama2, panorama3, panorama4, panorama5);

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

// Actualizar el tween en el loop de renderizado
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
}

animate();

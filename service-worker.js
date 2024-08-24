const CACHE_NAME = 'turismo-cauca-cache-v1';
const urlsToCache = [
  '/',
  '/pruebaVR.html',
  '/manifest.json',

  'https://unpkg.com/three@0.159.0/build/three.module.js',
  'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js',
  'https://unpkg.com/three@0.159.0/examples/jsm/webxr/XRControllerModelFactory.js',

  '/audios/catedral.mp3',
  '/audios/torre_reloj.mp3',

  '/images/c.png',
  '/images/catedralb.jpg',
  '/images/infobb.png',
  '/images/locaatio.png',
  '/images/next.png',
  '/images/pop.jpg',
  '/images/purace.jpg',
  '/images/silviaa.jpg',
  '/images/tierradentro.png',

  '/Popayan/1.jpg',
  '/Popayan/2.jpg',
  '/Popayan/4.jpg',
  '/Popayan/7.jpg',
  '/Popayan/666.jpg',
  '/Popayan/catt.jpg',

  '/silvia/entradasilvia.jpg',
  '/silvia/iglesia.jpg',
  '/silvia/in.jpg',
  '/silvia/jardin.jpg',
  '/silvia/mercado2.jpg',
  '/silvia/parque.jpg',
  '/silvia/truchera.jpg',

  '/sounds/bancolombia.ogg',
  '/sounds/button-press.ogg',
  '/sounds/button-release.ogg',
  '/sounds/catedral.ogg',
  '/sounds/catt.ogg',
  '/sounds/centrocaldas.ogg',
  '/sounds/hermita.ogg',
  '/sounds/humilladero.ogg',
  '/sounds/juanvaldez.ogg',

  '/textures/f.png',
  '/textures/full.png',
  '/textures/homew.png',
  '/textures/muted1.png',
  '/textures/normalscreen.png',
  '/textures/unmuted1.png',
  '/textures/x.png',

  '/videos/puente el humilladero.mp4',

  '/bird.glb',
  '/models.glb'


];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
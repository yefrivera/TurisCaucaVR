const CACHE_NAME = 'turismo-cauca-cache-v1';
const urlsToCache = [
  '/',
  '/TurisCaucaVR/pruebaVR.html',
  '/TurisCaucaVR/manifest.json',

  'https://unpkg.com/three@0.159.0/build/three.module.js',
  'https://unpkg.com/three@0.159.0/examples/jsm/webxr/VRButton.js',
  'https://unpkg.com/three@0.159.0/examples/jsm/webxr/XRControllerModelFactory.js',

  '/audios/catedral.mp3',
  '/audios/torre_reloj.mp3',

  '/TurisCaucaVR/images/c.png',
  '/TurisCaucaVR/images/catedralb.jpg',
  '/TurisCaucaVR/images/infobb.png',
  '/TurisCaucaVR/images/locaatio.png',
  '/TurisCaucaVR/images/next.png',
  '/TurisCaucaVR/images/pop.jpg',
  '/TurisCaucaVR/images/purace.jpg',
  '/TurisCaucaVR/images/silviaa.jpg',
  '/TurisCaucaVR/images/tierradentro.png',

  '/TurisCaucaVR/Popayan/1.jpg',
  '/TurisCaucaVR/Popayan/2.jpg',
  '/TurisCaucaVR/Popayan/4.jpg',
  '/TurisCaucaVR/Popayan/7.jpg',
  '/TurisCaucaVR/Popayan/666.jpg',
  '/TurisCaucaVR/Popayan/catt.jpg',

  '/TurisCaucaVR/silvia/entradasilvia.jpg',
  '/TurisCaucaVR/silvia/iglesia.jpg',
  '/TurisCaucaVR/silvia/in.jpg',
  '/TurisCaucaVR/silvia/jardin.jpg',
  '/TurisCaucaVR/silvia/mercado2.jpg',
  '/TurisCaucaVR/silvia/parque.jpg',
  '/TurisCaucaVR/silvia/truchera.jpg',

  '/TurisCaucaVR/sounds/bancolombia.ogg',
  '/TurisCaucaVR/sounds/button-press.ogg',
  '/TurisCaucaVR/sounds/button-release.ogg',
  '/TurisCaucaVR/sounds/catedral.ogg',
  '/TurisCaucaVR/sounds/catt.ogg',
  '/TurisCaucaVR/sounds/centrocaldas.ogg',
  '/TurisCaucaVR/sounds/hermita.ogg',
  '/TurisCaucaVR/sounds/humilladero.ogg',
  '/TurisCaucaVR/sounds/juanvaldez.ogg',

  '/TurisCaucaVR/textures/f.png',
  '/TurisCaucaVR/textures/full.png',
  '/TurisCaucaVR/textures/homew.png',
  '/TurisCaucaVR/textures/muted1.png',
  '/TurisCaucaVR/textures/normalscreen.png',
  '/TurisCaucaVR/textures/unmuted1.png',
  '/TurisCaucaVR/textures/x.png',

  '/TurisCaucaVR/videos/puente el humilladero.mp4',

  '/TurisCaucaVR/bird.glb',
  '/TurisCaucaVR/models.glb'


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
// service-worker.js
const CACHE_NAME = 'pomodoro-pro-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index.tsx', // Main React entry point
    '/App.tsx',
    '/types.ts',
    '/constants.ts',
    '/serviceWorkerRegistration.ts',
    '/services/geminiService.ts',
    '/components/Button.tsx',
    '/components/ModeButton.tsx',
    '/components/TimerDisplay.tsx',
    '/components/TimerControls.tsx',
    '/components/TaskInput.tsx',
    '/components/TaskList.tsx',
    '/components/AchievementBadge.tsx',
    '/components/BackgroundModeIndicator.tsx',
    '/components/Modals/StatsModal.tsx',
    '/components/Modals/SettingsModal.tsx',
    '/components/Modals/ThemeModal.tsx',
    '/components/Modals/GeminiModal.tsx',
    '/service-worker.js', // The service worker itself
    '/manifest.json', // PWA manifest
    // Placeholder icons for PWA manifest. In a real app, you'd create these and place them under /icons.
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

let timerInterval = null;
let currentState = null; // Stores { time: remainingSeconds, mode: 'pomodoro' }
let endTime = null;

self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('Service Worker instalado. Saltando la espera.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antigua', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
    console.log('Service Worker activado y clientes reclamados.');
});

self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // No cache hit - fetch from network
            return fetch(event.request).then(
                networkResponse => {
                    // Check if we received a valid response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    // IMPORTANT: Clone the response. A response is a stream
                    // and can only be consumed once. We must clone it so that
                    // the browser can consume one and we can consume the other.
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return networkResponse;
                }
            ).catch(() => {
                // This catch handles network errors
                // You could serve an offline page here if you had one
                console.log('Service Worker: Fallo en la red para', event.request.url);
                // If it's the main document, try to serve from cache even if not in urlsToCache
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Offline', { status: 503, statusText: 'Service Unavailable', headers: new Headers({ 'Content-Type': 'text/plain' }) });
            });
        })
    );
});


self.addEventListener('message', event => {
    const message = event.data;

    if (message.type === 'TIMER_START') {
        startBackgroundTimer(message.time, message.mode, message.endTime);
    }
    else if (message.type === 'TIMER_PAUSE') {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    else if (message.type === 'TIMER_RESET') {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        currentState = null;
        endTime = null;
    }
    else if (message.type === 'MODE_CHANGE') {
        if (currentState) {
            currentState.mode = message.mode;
        }
    }
});

function startBackgroundTimer(initialTime, mode, calculatedEndTime) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    currentState = {
        time: initialTime,
        mode: mode
    };

    endTime = calculatedEndTime;

    timerInterval = setInterval(() => {
        // Calculate remaining time based on predicted end time to avoid drift
        const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        currentState.time = remaining;

        // Send update to all clients
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'TIMER_UPDATE',
                    time: currentState.time,
                    mode: currentState.mode
                });
            });
        });

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            // Notify timer end
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'TIMER_END'
                    });
                });
            });

            // Show notification
            showNotification();

            // Reset current state after completion
            currentState = null;
            endTime = null;
        }
    }, 1000); // Check every second
}

function showNotification() {
    if (!currentState) return;

    let title, body;
    let iconUrl = '/icons/icon-192x192.png'; // Use PWA icon

    switch(currentState.mode) {
        case 'pomodoro':
            title = '¡Pomodoro completado!';
            body = 'Toma un descanso corto';
            break;
        case 'shortBreak':
            title = '¡Descanso corto terminado!';
            body = 'Hora de volver a trabajar';
            break;
        case 'longBreak':
            title = '¡Descanso largo terminado!';
            body = 'Prepárate para otra sesión';
            break;
        case 'deepFocus':
            title = '¡Sesión de enfoque profundo completada!';
            body = 'Excelente trabajo';
            break;
        default:
            title = '¡Temporizador completado!';
            body = 'Tu sesión ha terminado.';
    }

    self.registration.showNotification(title, {
        body: body,
        icon: iconUrl,
        vibrate: [200, 100, 200]
    });
}
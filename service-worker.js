// service-worker.js
let timerInterval = null;
let currentState = null; // Stores { time: remainingSeconds, mode: 'pomodoro' }
let endTime = null;

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
    let iconUrl = 'https://picsum.photos/64/64'; // Placeholder icon

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

// Keep service worker alive and claim clients on activate
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
    console.log('Service Worker activado y clientes reclamados.');
});

self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('Service Worker instalado. Saltando la espera.');
});

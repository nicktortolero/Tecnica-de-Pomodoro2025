// serviceWorkerRegistration.ts
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Create a blob URL for the service worker script
        // In a production environment, you would typically serve a static service-worker.js file.
        const swUrl = URL.createObjectURL(new Blob([`
            ${document.querySelector('script[src="./service-worker.js"]')?.textContent || ''}
            // Fallback for when the above doesn't work (e.g., if script not inlined or moved)
            // If the above fails, consider fetching the script from a known path:
            // importScripts('/service-worker.js');
        `], { type: 'application/javascript' }));

        navigator.serviceWorker.register('/service-worker.js') // Register the actual service-worker.js file
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
            console.log('Service Worker unregistered.');
        });
    }
}

export function registerSW() {
    const supportsSW = !!navigator.serviceWorker;
    if (!supportsSW) {
        return;
    }
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service worker registered'))
            .catch(() => console.log('Could not register service worker'));
    }, { once: true });

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        var button = document.getElementById('install');
        button.removeAttribute('hidden');
        button.addEventListener('click', () => {
            event.prompt();
        });
    },{once:true});
}
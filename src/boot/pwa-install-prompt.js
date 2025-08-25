let deferredPrompt;

export default ({ app }) => {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = event;

    // Trigger a global event to show the install prompt
    app.config.globalProperties.$q.notify({
      message: 'Install our app for a better experience!',
      timeout: 5000,
      actions: [
        {
          label: 'Install',
          handler: () => {
            showInstallPrompt();
          }
        }
      ]
    });
  });
};

function showInstallPrompt() {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the deferredPrompt variable, as it can only be used once.
      deferredPrompt = null;
    });
  }
}
export function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  

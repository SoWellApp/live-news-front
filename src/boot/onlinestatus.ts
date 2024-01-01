import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  const checkOnlineStatus = () => {
    app.config.globalProperties.$isOnline = navigator.onLine;
  };

  checkOnlineStatus();

  window.addEventListener('online', checkOnlineStatus);
  window.addEventListener('offline', checkOnlineStatus);

  // Cleanup event listeners when the app is destroyed
  app.mixin({
    beforeUnmount() {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    },
  });
})

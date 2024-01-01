import { boot } from 'quasar/wrappers'
import localforage from 'localforage'

localforage.config({
  driver: localforage.INDEXEDDB, // this is the most recommended driver for localforage
  name: "live-news"
})
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, }) => {
  app.config.globalProperties.$localforage = localforage
  // ^ ^ ^ this will allow you to use this.$localforage (for Vue Options API form)
  //       so you won't necessarily have to import localforage in each vue file

})


export { localforage }
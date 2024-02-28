import axios from 'axios';
import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async () => {
  axios.defaults.baseURL = 'http://localhost:5000';
  axios.defaults.withCredentials = true;
});

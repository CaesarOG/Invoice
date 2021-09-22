import localStorage from './local-storage-service';
import api from './api-service'


//logger-service
// tslint:disable-next-line:no-console
const log = console.log;

export default {
  localStorage,
  api,
  logger: {log}
};
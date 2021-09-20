import dataProc from './dataproc-service';
import localStorage from './local-storage-service';
import api from './api-service'


//logger-service
// tslint:disable-next-line:no-console
const log = console.log;

export default {
  localStorage,
  dataProc,
  api,
  logger: {log}
};
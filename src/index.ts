export { supervisorHandler } from './handlers/supervisor-handler';

import { supervisorHandler} from './handlers/supervisor-handler';

supervisorHandler('Hello, greet me and also say goodbye.').then((result) => {
  console.log('result is: ', result);
}).catch((err) => {
  console.error('error is', err);
});

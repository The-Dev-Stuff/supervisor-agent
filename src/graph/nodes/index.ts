import { NODES } from '../../constants/nodes';

import { GoodbyeNode } from './goodbye';
import { GreetingNode } from './greeting';
import { CompletionNode } from './completion';
import { SupervisorNode } from './supervisor';
import { LoadWeatherNode } from './load-weather';

export const taskNodes = [
  NODES.GREETING,
  NODES.GOODBYE,
  NODES.LOAD_WEATHER
]

export { GoodbyeNode } from './goodbye';
export { GreetingNode } from './greeting';
export { CompletionNode } from './completion';
export { SupervisorNode } from './supervisor';
export { LoadWeatherNode } from './load-weather';




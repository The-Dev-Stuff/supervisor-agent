import { supervisorGraph } from '../graph';

export const supervisorHandler = async (inputMessage: string) => {
  return await supervisorGraph.run(inputMessage);
}

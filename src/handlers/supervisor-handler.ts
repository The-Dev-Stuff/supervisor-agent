import { SupervisorGraph } from '../graph';

export const supervisorHandler = async (inputMessage: string) => {
  const supervisor = new SupervisorGraph();
  return await supervisor.run(inputMessage);
}

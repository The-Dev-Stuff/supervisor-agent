import { GraphState, StateAnnotation } from '../state';

export const completion = {
  definition: {
    id: 'completion',
    name: 'Completion Node',
    description: 'A node that is called at the end of the workflow.',
    type: 'static',
    output: 'text',
    tags: [
      'sync',
      'static'
    ]
  },
  skills: [
    'complete_flow'
  ],
  run: async (state: typeof StateAnnotation.State) => {
    // This should build a request body to fire off an event to event bus or webhook etc..
    // It should send the event and finally just respond with a message saying it is done
    console.log("Running completion node with state:", state);
    return {
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'End was reached!'
      }],
    };
  }
};

import { GraphState, StateAnnotation } from '../state';

export const respond = {
  definition: {
    id: 'respond',
    name: 'Respond Node',
    description: 'A node that responds to original caller after the flow is complete.',
    type: 'static',
    output: 'text',
    tags: [
      'sync',
      'static'
    ]
  },
  run: async (state: typeof StateAnnotation.State) => {
    // This should build a request body to fire off an event to event bus or webhook etc..
    // It should send the event and finally just respond with a message saying it is done
    console.log("Running respond node with state:", state);
    return {
      ...state,
      messages: [...state.messages, "End was reached! Responding to user"],
    };
  }
};

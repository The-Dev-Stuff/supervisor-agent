import { AIMessage } from '@langchain/core/messages';
import { StateAnnotation } from '../state';

export const goodbye = {
  definition: {
    id: 'goodbye',
    name: 'Goodbye Node',
    description: 'A node that says goodbye to a user.',
    type: 'static',
    output: 'text',
    tags: [
      'sync',
      'static'
    ]
  },
  skills: [
    'say_goodbye_to_users',
    'says_farewell_to_users'
  ],
  run: async (state: typeof StateAnnotation.State) => {
    console.log('Goodbye node called');

    return {
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Goodbye and have a great day!'
      }],
    }
  }
};

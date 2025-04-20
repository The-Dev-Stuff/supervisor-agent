import { AIMessage } from '@langchain/core/messages';
import { StateAnnotation } from '../state';

export const greeting = {
  definition: {
    id: 'greeting',
    name: 'Greeting Node',
    description: 'A node that greets the user when a workflow begins.',
    type: 'static',
    output: 'text',
    tags: [
      'sync',
      'static'
    ]
  },
  skills: [
    'greet_users',
    'say_hello_to_users'
  ],
  run: async (state: typeof StateAnnotation.State) => {
    const previousMessageToolCall = state.messages[state.messages.length - 1].tool_calls;

    console.log('Greeting node called');
    return {
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Hello! How can I assist you today?'
      }],
    }
  }
};

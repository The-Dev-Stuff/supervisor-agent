import { StateAnnotation } from '../state';
import { AbstractGraphNode } from '../../models/GraphNode';

export class GreetingNode extends AbstractGraphNode {
  static definition = {
    id: 'greeting',
    name: 'Greeting Node',
    description: 'A node that greets the user when a workflow begins.',
    type: 'static',
    output: 'text',
    tags: [
      'sync',
      'static'
    ]
  };

  static skills = [
    'greet_users',
    'say_hello_to_users'
  ];

  static async run(state: typeof StateAnnotation.State) {
    return {
      lastToolCalled: 'greeting',
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Hello! How can I assist you today?'
      }],
    };
  }
}

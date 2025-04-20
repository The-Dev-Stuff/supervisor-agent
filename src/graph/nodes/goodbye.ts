import { StateAnnotation } from '../state';
import { AbstractGraphNode } from '../../models/GraphNode';

export class GoodbyeNode extends AbstractGraphNode {
  static definition = {
    id: 'goodbye',
    name: 'Goodbye Node',
    description: 'A node that says goodbye to a user.',
    type: 'static',
    output: 'text',
    tags: [
      'sync',
      'static'
    ]
  };

  static skills = [
    'say_goodbye_to_users',
    'says_farewell_to_users'
  ];

  static async run(state: typeof StateAnnotation.State) {
    return {
      lastToolCalled: 'goodbye',
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Goodbye and have a great day!'
      }],
    }
  }
}

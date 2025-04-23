import { StateAnnotation } from '../state';
import { AbstractGraphNode } from '../../models/GraphNode';

export class GoodbyeNode extends AbstractGraphNode {
  static definition = {
    "type": "function",
    "function": {
      "name": "goodbye",
      "description": "A node that says goodbye to a user.",
      "parameters": {
        "type": "object",
        "properties": {
          "reason": {
            "type": "string",
            "description": "The reason this tool was selected based on the user's message."
          }
        },
        "required": ["reason"]
      }
    }
  };

  static skills = [
    'say_goodbye_to_users',
    'says_farewell_to_users'
  ];

  static async run(state: typeof StateAnnotation.State) {
    return {
      toolCallChain: 'goodbye',
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Goodbye and have a great day!'
      }],
    }
  }
}

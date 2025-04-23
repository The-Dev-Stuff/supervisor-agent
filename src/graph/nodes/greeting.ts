import { StateAnnotation } from '../state';
import { AbstractGraphNode } from '../../models/GraphNode';

export class GreetingNode extends AbstractGraphNode {
  static definition = {
    "type": "function",
  "function": {
    "name": "greeting",
    "description": "Greets the user and asks how they can assist.",
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
    'greet_users',
    'say_hello_to_users'
  ];

  static async run(state: typeof StateAnnotation.State) {
    return {
      toolCallChain: 'greeting',
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Hello! How can I assist you today?'
      }],
    };
  }
}




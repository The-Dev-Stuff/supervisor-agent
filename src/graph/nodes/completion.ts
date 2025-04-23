import { StateAnnotation } from '../state';
import { AbstractGraphNode } from '../../models/GraphNode';

export class CompletionNode extends AbstractGraphNode {
  static definition = {
    "type": "function",
    "function": {
      "name": "completion",
      "description": "A node that is called at the end of the workflow.",
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
  }

  static skills = [
    'complete_flow'
  ];

  static async run(state: typeof StateAnnotation.State) {
    // This should build a request body to fire off an event to event bus or webhook etc..
    // It should send the event and finally just respond with a message saying it is done
    return {
      toolCallChain: 'completion',
      ...state.messages,
      messages: [{
        role: 'assistant',
        content: 'Agent has completed all tasks for query!'
      }],
    };
  }
}

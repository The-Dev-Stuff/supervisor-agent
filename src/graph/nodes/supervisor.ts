import { StateAnnotation } from '../state';
import { Command } from '@langchain/langgraph';
import { llmService } from '../../services/llm-service'
import { GreetingNode, GoodbyeNode, CompletionNode } from './index';
import { AbstractGraphNode } from '../../models/GraphNode';
import colors from 'yoctocolors';

export class SupervisorNode extends AbstractGraphNode {
  static definition = {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Supervisor node to handle supervisor-related tasks and call LLM for reasoning to determine the next node to call.',
    type: 'supervisor',
    output: 'text',
    tags: [
      'async',
      'static'
    ]
  };

  static skills = [];

  static availableTools = [GreetingNode.definition, GoodbyeNode.definition, CompletionNode.definition];

  static async run(state: typeof StateAnnotation.State) {
    /* This needs to be a tool call to an llm where we provide
        - The system prompt
        - The conversation so far
        - The list of workers
        - The user request
        - The options for next steps
        (Eventually a list of output from other llms)
     */
    if (process.env.DEBUG === 'true') {
      console.log('supervisor called with following state ', { state });
    }


    /* TODO: Update so each tool includes the tool_calls in their message history and we then add a role=tool message
      "messages": [
    // previous messages...
    {
      "role": "assistant",
      "tool_calls": [
        {
          "id": "call_12345xyz",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Paris, France\"}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_12345xyz",
      "content": "The weather in Paris is sunny and 21°C."
    }
  ]


     */


    const result = await llmService.invokeWithTools(
      SupervisorNode.buildPrompt(state.messages),
      SupervisorNode.availableTools
    );

    const reason = JSON.parse(result.function.arguments).reason;
    const nextNode = result.function.name;

    SupervisorNode.logReasoning(nextNode, reason);

    return new Command({
      update: {
        toolCallChain: 'supervisor',
        messages: [
          {
            role: "assistant",
            content: `Called ${nextNode}. Reason: ${reason || 'No reason provided'}`
          }
        ],
      },
      goto: nextNode
    });
  };

  static buildPrompt(messages) {
    return [
      {
        role: 'system',
        content: `You are a router. Call exactly one function. Include the reason for your choice in the 'reason' field..`
      },
      ...messages.map((message) => ({
        role: message.role || message.getType(),
        content: message.content || ''
      }))
    ];
  };

  static logReasoning(nextNode: string, reason: string) {
    console.log(colors.blue(`Calling ${colors.green(nextNode)}, reason: ${colors.green(reason || 'No reason provided')}`));

    if (process.env.LOG_REASONING === 'true') {
      console.log({
        event: 'Supervisor Reasoning',
        nextNode,
        reason
      });
    }
  }
}

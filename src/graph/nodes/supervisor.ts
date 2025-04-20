import { StateAnnotation } from '../state';
import { Command } from '@langchain/langgraph';
import { llmService } from '../../services/llm-service'
import { routingTool } from '../../tools/routing';
import { GreetingNode, GoodbyeNode, CompletionNode } from './index';
import { AbstractGraphNode } from '../../models/GraphNode';
import console from 'node:console';

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

  static availableWorkers = [GreetingNode.definition, GoodbyeNode.definition, CompletionNode.definition];
  static availableSkills = [...GreetingNode.skills, ...GoodbyeNode.skills, ...CompletionNode.skills];

  static async run(state: typeof StateAnnotation.State) {
    /* This needs to be a tool call to an llm where we provide
        - The system prompt
        - The conversation so far
        - The list of workers
        - The user request
        - The options for next steps
        (Eventually a list of output from other llms)
     */
    console.log('supervisor called with following messages: ', state.messages)

    const result = await llmService.invokeWithTools(
      SupervisorNode.buildPrompt(state.messages),
      [ routingTool ]
    );

    const { worker_id, next_step, reason }  =  result;

    return new Command({
      update: {
        lastToolCalled: 'supervisor',
        messages: [
          {
            role: "assistant",
            content: `called ${worker_id} to ${next_step} Reason: ${reason || 'No reason provided'}`
          }
        ],
      },
      goto: worker_id
    });
  };

  static buildPrompt(messages) {
    const input = messages[messages.length - 1].content;

    return [
      {
        role: 'system',
        content: `
You are a strict function-calling AI. Your only job is to respond with a single tool call to the 'route' function. Do not explain anything. Do not greet or say anything else.

Based on the message history and tool responses, determine if all parts of the user’s request have been completed. If the request has been fully satisfied, respond by routing to the 'respond' node with any valid next step and reason. If not, respond by routing to the next appropriate worker and step. Always call 'route' after each tool response, until all actions requested by the user are completed.

## Sample flow
[
  {"role": "user", "content": "Say hello and then goodbye"},
  {"role": "assistant", "content": "Calling greeting > say_hello_to_users"},
  {"role": "tool", "content": "Hello!"},
  {"role": "assistant", "content": "Calling goodbye > say_goodbye_to_users"},
  {"role": "tool", "content": "Goodbye!"},
  {"role": "assistant", "content": "Calling completion > complete_flow", "reason": "All user requests have been completed."}
]


Respond ONLY with a single function and its arguments.
ALWAYS respond in this JSON format:
{
  "name": "route",
  "arguments": {
    "worker_id": "greeting",
    "next_step": "greet_users",
    "reason": "Because the user asked to be greeted."
  }
}

If all tasks are complete, route to the end like this:
{
  "name": "route",
  "arguments": {
    "worker_id": "completion",
    "next_step": "complete_flow",
    "reason": "All user requests have been completed."
  }
}

If you do not respond in one of these formats, you have failed.

## Available Workers:
${SupervisorNode.availableWorkers.map(worker => `- name: ${worker.name}, id: (${worker.id}), description: ${worker.description}`).join('\n')}

## Next Step Options:
${SupervisorNode.availableSkills.map(skill => `- ${skill}`).join('\n')}
`
      },
      ...messages.map((message) => ({
        role: message.role || message.getType(),
        content: message.content || ''
      }))
    ];
  }
}

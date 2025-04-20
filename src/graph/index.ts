import { CompiledGraph, END, START, StateDefinition, StateGraph } from '@langchain/langgraph';
import {
  GreetingNode,
  GoodbyeNode,
  taskNodes,
  SupervisorNode,
  LoadWeatherNode,
  CompletionNode,
} from './nodes';
import { NODES } from '../constants/nodes';
import { StateAnnotation } from './state';

export class SupervisorGraph {
  private compiledGraph: CompiledGraph<any>;

  constructor() {
    console.log('Initializing SupervisorGraph...');
  }

  private async initializeGraph() {
    const graph = new StateGraph<StateDefinition>(StateAnnotation as any);

    graph
      .addNode(NODES.SUPERVISOR, SupervisorNode.run, {
        /**
         * Supervisor can go to anyone of the task nodes
         * **These can be provided at runtime or filtered down by the app based on access restrictions/feature flags, etc..
         */
        ends: [...taskNodes, NODES.COMPLETION],
      })
      // Register the nodes and their respective run methods
      .addNode(NODES.GREETING, GreetingNode.run)
      .addNode(NODES.GOODBYE, GoodbyeNode.run)
      .addNode(NODES.LOAD_WEATHER, LoadWeatherNode.run)
      .addNode(NODES.COMPLETION, CompletionNode.run);

    /**
     * The only edges we need to strictly define are the start and end.
     * Movement between nodes is handled by the LLM's decision-making.
     */
    graph
      .addEdge(START, NODES.SUPERVISOR)
      .addEdge(NODES.COMPLETION, END);

    // All task nodes go to the supervisor after they run
    taskNodes.forEach(node => graph.addEdge(node, NODES.SUPERVISOR));

    this.compiledGraph = graph.compile();
  }

  public async run(inputMessage: string): Promise<any> {
    if (!this.compiledGraph) {
      await this.initializeGraph();
    }

    return await this.compiledGraph.invoke({
      messages: [
        {
          role: 'user',
          content: inputMessage
        }
      ]
    });
  }
}

export const supervisorGraph = new SupervisorGraph();

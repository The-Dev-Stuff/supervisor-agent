import { CompiledGraph, END, START, StateDefinition, StateGraph } from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { completion, greeting, supervisor, loadWeather, goodbye } from './nodes';
import { NODES } from './constants/nodes';
import { StateAnnotation } from './state';

export class SupervisorGraph {
  private compiledGraph: CompiledGraph<any>;

  constructor() {
    console.log('Initializing SupervisorGraph...');
  }

  private async initializeGraph() {
    const graph = new StateGraph<StateDefinition>(StateAnnotation as any);

    graph
      .addNode(NODES.SUPERVISOR, supervisor.run, {
        // Supervisor can go to anyone of these nodes
        ends: [NODES.GREETING, NODES.GOODBYE, NODES.LOAD_WEATHER, NODES.COMPLETION],
      })
      .addNode(NODES.GREETING, greeting.run)
      .addNode(NODES.GOODBYE, goodbye.run)
      .addNode(NODES.LOAD_WEATHER, loadWeather.run)
      .addNode(NODES.COMPLETION, completion.run);


    /**
     * The only edges we need to define are the start and end.
     * Movement between nodes is handled by the LLM's decision-making.
     */
    graph
      .addEdge(START, NODES.SUPERVISOR)
      .addEdge(NODES.GREETING, NODES.SUPERVISOR)
      .addEdge(NODES.GOODBYE, NODES.SUPERVISOR)
      .addEdge(NODES.COMPLETION, END);

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

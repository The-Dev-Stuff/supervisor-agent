import { StateAnnotation } from '../graph/state';

export abstract class AbstractGraphNode {
  static definition: Record<string, any>;
  static skills: string[];

  static async run(state?: typeof StateAnnotation.State): Promise<any> {};
}

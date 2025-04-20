import { Annotation } from '@langchain/langgraph';

export interface GraphState {
  messages: string[];
}

export const StateAnnotation = Annotation.Root({
  sentiment: Annotation<string>,
  messages: Annotation<any[]>({
    reducer: (left: any[], right: any | any[]) => {
      if (Array.isArray(right)) {
        return left.concat(right);
      }
      return left.concat([right]);
    }, default: () => [],
  }),
});

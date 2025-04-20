import { Annotation } from '@langchain/langgraph';

export const StateAnnotation = Annotation.Root({
  toolCallChain: Annotation<string[]>({
    reducer: (a: string[], b: string) => [...a, b],
    default: () => [],
  }),
  messages: Annotation<any[]>({
    reducer: (left: any[], right: any | any[]) => {
      if (Array.isArray(right)) {
        return left.concat(right);
      }
      return left.concat([right]);
    }, default: () => [],
  }),
});

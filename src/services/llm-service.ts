import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

class LlmService {
  private generateApiUrl: string;
  private completionsApiUrl: string;
  private model: string;
  private apiKey: string;

  constructor() {
    this.generateApiUrl = process.env.LLM_GENERATE_API_URL || '';
    this.completionsApiUrl = process.env.LLM_COMPLETIONS_API_URL || '';
    this.model = process.env.LLM_MODEL || '';
    this.apiKey = process.env.OPENAI_API_KEY || '';

    if (!this.model) {
      throw new Error('LLM_MODEL is not defined in the .env file');
    }
  }

  /**
   * Function to invoke the LLM with a given prompt via HTTP request.
   * @param prompt - The input prompt to send to the LLM.
   * @returns The response from the LLM.
   */
  public async invoke(prompt: string): Promise<string> {
    try {
      const response = await axios.post(this.generateApiUrl, {
        model: this.model,
        prompt,
        stream: false,
      });

      return response.data?.response;
    } catch (error) {
      console.error('Error invoking LLM:', error);
      throw new Error('Failed to invoke the LLM');
    }
  }

  /**
   * Function to invoke the LLM with tools via HTTP request.
   * @param messages - The messages to send to the LLM. Includes system, user, and assistant messages.
   * @param tools - The tools to use with the LLM.
   * @returns The response from the LLM.
   */
  public async invokeWithTools(messages: any, tools: any[]): Promise<any> {
    try {
      const response = await axios.post(
        this.completionsApiUrl,
        {
          model: this.model,
          messages,
          tools,
          tool_choice: 'auto',
          stream: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      if (response.data?.choices[0]?.message?.tool_calls) {
        return JSON.parse(response.data?.choices[0]?.message?.tool_calls[0]?.function?.arguments);
      } else {
        return JSON.parse(response.data?.choices[0]?.message?.content).arguments;
      }
    } catch (error) {
      console.error('Error invoking LLM with tools:', JSON.stringify(error, null, 2));
      throw new Error('Failed to invoke the LLM with tools');
    }
  }
}

export const llmService = new LlmService();

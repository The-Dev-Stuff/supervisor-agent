import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const LLM_API_URL = 'http://localhost:11434/v1/chat/completions';
const LLM_MODEL = process.env.LLM_MODEL;

/**
 * Function to invoke the LLM with a given prompt.
 * @param prompt - The input prompt to send to the LLM.
 * @returns The response from the LLM.
 */
export const invokeLLM = async (prompt: string): Promise<string> => {
  if (!LLM_MODEL) {
    throw new Error('LLM_MODEL is not defined in the .env file');
  }

  try {
    const response = await axios.post(LLM_API_URL, {
      model: LLM_MODEL,
      prompt,
      stream: false
    });



    const result = response.data?.response;



    if (!result) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error invoking LLM:', error);
    throw new Error('Failed to invoke the LLM');
  }
}

/**
 * Function to invoke an llm with a tools call
 *
 */
// export const invokeLLMWithTools = async (messages: any, tools: any[], toolChoice: any): Promise<any> => {
//   if (!LLM_MODEL) {
//     throw new Error('LLM_MODEL is not defined in the .env file');
//   }
//   console.log('request is: ', {
//     model: LLM_MODEL,
//     messages,
//     tools,
//     tool_choice: toolChoice,
//     stream: false
//   })
//
//   try {
//     const response = await axios.post(LLM_API_URL, {
//       model: LLM_MODEL,
//       messages,
//       tools,
//       tool_choice: toolChoice,
//       stream: false
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });
//
//     console.log('llama response: ', response.data);
//
//     console.log(JSON.stringify(response.data, null, 2));
//     const result = response.data?.choices[0]?.message?.tool_calls[0];
//
//     if (!result) {
//       throw new Error(`no response available: ${response.data?.response}`);
//     }
//
//     return response.data?.choices[0]?.message?.tool_calls[0];
//
//   } catch (error) {
//     console.error('Error invoking LLM with tools:', JSON.stringify(error, null, 2));
//     throw new Error('Failed to invoke the LLM with tools');
//   }
// }


export const invokeLLMWithTools = async (messages: any, tools: any[], toolChoice: any): Promise<any> => {
  if (!LLM_MODEL) {
    throw new Error('LLM_MODEL is not defined in the .env file');
  }
  console.log('request is: ',       {
    model: "gpt-3.5-turbo",
    messages,
    tools: tools, // Assuming this is a variable declared elsewhere
    tool_choice: "auto",
    stream: false,
  })

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        tools,
        tool_choice: "auto",
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    if (response.data?.choices[0]?.message?.tool_calls) {
      return JSON.parse(response.data?.choices[0]?.message?.tool_calls[0]?.function?.arguments)
    } else {
      return JSON.parse(response.data?.choices[0]?.message?.content).arguments;
    }

  } catch (error) {
    console.error('Error invoking LLM with tools:', JSON.stringify(error, null, 2));
    throw new Error('Failed to invoke the LLM with tools');
  }
}

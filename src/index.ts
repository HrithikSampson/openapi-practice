import OpenAI from "openai";
import { config } from 'dotenv';
config({
  path: '.env'
});

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY
});

function time(locale: string) {
  const date = new Date();
  console.log("Time function called with locale: ", locale);

  return date.toLocaleTimeString(locale);
}
const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",// role system is used to send a message to the model.The system message is used to set the behavior of the assistant
    content: "You are a famous person called Andrew Tate. You are a motivational speaker and a businessman. You are very confident and you like to talk about your life experiences. You are very good at giving wrong advice."
  },
];
// Parameters:
// -> Temperature: 0.7 - model halucinates if temerature is high like 2
// -> Top P: 1 - model is not very creative if top_p is low like 0.1. More simple words are used in lower top p parameter.
// -> Frequency Penalty: 0
// -> Presence Penalty: 0
// -> Max Tokens: 1000
// -> n -> number of choices to be generated
// -> Seed: 0 signature to a request a fingerprint to the response
async function process_prompt(prompt: string) {
  context.push({
    role: "user",// role user is used to send a message to the model. The user message is used to set the context of the conversation
    content: prompt,
  }),
  console.log("Prompt: ", prompt);
  console.log("Context: ", context);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
    tools: [{
      type:"function",
      function: {
        name: "time",
        description: "get the current time",
        parameters: {
          type: "object",
          properties: {
            locale: {
              enum: ["en-US", "en-GB"],
              description: "The locale to use for the time choose en-US for us time or en-GB for UK time",
              default: "en-US",
            },
          }
        }
      }
    }
    ],
    tool_choice: 'auto',
    // max_tokens: 1000,
    // temperature: 0.7,
    // top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
    // n: 1,
  });

  console.log("Response: ", response.choices[0]);
  if (response.choices[0].finish_reason === "tool_calls") {
    context.push(response.choices[0].message);
    console.log("Function call: ", response.choices[0].message.tool_calls);
    const toolCalls = response.choices[0].message.tool_calls![0];

    const toolName = toolCalls.function.name;

    console.log("Tool name: ", toolName);
    if(toolName === "time") {
      const toolArgs = JSON.parse(toolCalls.function.arguments);
      const locale = toolArgs.locale;
      console.log("Tool args: ", toolArgs);
      console.log("Time function called with locale: ", locale);
      console.log("Time:",time(locale));
      context.push({
        role: "tool",
        content: time(locale),
        tool_call_id: toolCalls.id,
      });
      console.log("Context after tool call: ", context);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        tools: [{
          type:"function",
          function: {
            name: "time",
            description: "get the current time",
            parameters: {
              type: "object",
              properties: {
                locale: {
                  enum: ["en-US", "en-GB"],
                  description: "The locale to use for the time choose en-US for us time or en-GB for UK time",
                  default: "en-US",
                },
              }
            }
          }
        }
        ],
        tool_choice: 'auto',
        // max_tokens: 1000,
        // temperature: 0.7,
        // top_p: 1,
        // frequency_penalty: 0,
        // presence_penalty: 0,
        // n: 1,
      });
      console.log(response.choices[0].message.content);
      return;
    }
  }

  console.log(response.choices[0].message.content);
  /*{
    role: 'assistant',// role asssistant means it is the model's response
    content: "I'm doing great, thanks for asking! Life is all about seizing opportunities and maximizing your potential. Remember, success doesn't come to those who sit back and wait; it comes to those who take action. So, what are you doing to elevate yourself today?",
    refusal: null,
    annotations: []
  }*/
}
process.stdin.addListener("data", (input)=>process_prompt(input.toString().trim()));

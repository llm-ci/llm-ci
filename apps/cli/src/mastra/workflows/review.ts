import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const maxTurns = 30;

export const reviewWorkflow = createWorkflow({
  id: "reviewWorkflow",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
});

const messageOutputStep = createStep({
  id: "message-output",
  description: "This step outputs the message to the console",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { target, lang } = inputData;
    const prompt = `
Please vulnerability scan the code at ${target} and provide a report on potential security issues.
The report should be in ${lang} and you should finish the code review in ${maxTurns} turns`;

    const messages: SDKMessage[] = [];
    for await (const message of query({
      prompt,
      abortController: new AbortController(),
      options: {
        maxTurns,
        permissionMode: "bypassPermissions",
        appendSystemPrompt:
          "You are a security expert. You can find vulnerabilities in code and provide detailed reports on potential security issues.",
      },
    })) {
      messages.push(message);

      if (
        message.type === "assistant" &&
        message.message.type === "message" &&
        "content" in message.message &&
        Array.isArray(message.message.content)
      ) {
        for (const content of message.message.content) {
          if (content.type === "text" && content.text) {
            console.info("Claude: ", content.text);
          }
        }
      }
    }

    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage ||
      lastMessage.type !== "result" ||
      !("result" in lastMessage)
    ) {
      throw new Error("No valid response from Claude AI.");
    }
    return {
      // https://docs.anthropic.com/en/docs/claude-code/sdk#message-schema
      comment: lastMessage.result, // last message is the result
    };
  },
});

reviewWorkflow.then(messageOutputStep).commit();

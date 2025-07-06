import { execSync } from "node:child_process";
import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const maxTurns = 100;
const tscCommand = "npx tsc --noEmit --skipLibCheck --diagnostics";

export const typescriptWorkflow = createWorkflow({
  id: "typescriptWorkflow",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
});

const typescriptScanStep = createStep({
  id: "typescript-scan",
  description: "This step scan TypeScript performance",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
  }),
  outputSchema: z.object({
    lang: z.string(),
    target: z.string(),
    tscResult: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { lang, target } = inputData;
    const result = execSync(tscCommand, {
      cwd: target,
    });

    const resultDiagnostics = result.toString();
    console.log(resultDiagnostics);
    return {
      lang,
      target,
      tscResult: resultDiagnostics,
    };
  },
});

const messageOutputStep = createStep({
  id: "message-output",
  description: "This step outputs the message to the console",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
    tscResult: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { tscResult, lang, target } = inputData;
    const prompt = `
# Language:
- You should speak and write in ${lang}.

# Background:
- Below tsc result is our npm package tsc diagnostics result. It is obtained by running the command: \`${tscCommand}\`.

# Your Task:
- Understand diagnostics result.
- If the result meaning tsc too slow, you must research reason why tsc is too slow in the package. (package dir is ${target})
- If you can, you suggest fix plan to improve tsc performance with confidence score.
- You must done this task within ${maxTurns} turns.

# Report Format:
- The report should be contain the following items:
  - Tsc diagnostics result is too slow or not
  - If it is too slow, explain why it is too slow
  - If it is too slow, suggest fix plan to improve tsc performance with confidence score (2 or 3 suggestions are recommended)

# TSC Targer:
- Target: ${target}

# TSC Result:
${tscResult}
`;

    const messages: SDKMessage[] = [];
    for await (const message of query({
      prompt,
      abortController: new AbortController(),
      options: {
        maxTurns,
        permissionMode: "bypassPermissions",
        appendSystemPrompt: `
You are a TypeScript expert. You are able to analyze TypeScript diagnostics and suggest improvements for performance issues.
`,
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
      console.error({ lastMessage });
      throw new Error("No valid response from Claude AI.");
    }
    return {
      // https://docs.anthropic.com/en/docs/claude-code/sdk#message-schema
      comment: lastMessage.result, // last message is the result
    };
  },
});

typescriptWorkflow.then(typescriptScanStep).then(messageOutputStep).commit();

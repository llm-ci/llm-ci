import { execSync } from "node:child_process";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

export const reviewWorkflow = createWorkflow({
  id: "reviewWorkflow",
  inputSchema: z.object({
    lang: z.string(),
    filePath: z.string(),
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
    filePath: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { filePath, lang } = inputData;
    const message = `Please security review file at ${filePath} in ${lang}`;

    // TODO: remove dangerously-skip-permissions, and use TypeScript SDK
    const claudeResult = execSync(
      `/Users/user/.volta/bin/claude -p "${message}" --dangerously-skip-permissions`,
    );

    const comment = claudeResult.toString();
    return { comment };
  },
});

reviewWorkflow.then(messageOutputStep).commit();

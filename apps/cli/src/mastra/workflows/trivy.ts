import { execSync } from "node:child_process";
import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const maxTurns = 300;

export const trivyWorkflow = createWorkflow({
  id: "trivyWorkflow",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
});

const trivyScanStep = createStep({
  id: "trivy-scan",
  description: "This step scan repository with Trivy",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
    lockFile: z.string(),
  }),
  outputSchema: z.object({
    lang: z.string(),
    scanResult: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { target, lockFile } = inputData;
    const result = execSync(
      `docker run -v $PWD:/myapp aquasec/trivy fs /myapp/${lockFile} --quiet`,
      {
        cwd: target,
      },
    );

    const resultTextTable = result.toString();
    console.log(resultTextTable);
    return {
      lang: inputData.lang,
      scanResult: resultTextTable,
    };
  },
});

const messageOutputStep = createStep({
  id: "message-output",
  description: "This step outputs the message to the console",
  inputSchema: z.object({
    lang: z.string(),
    target: z.string(),
    scanResult: z.string(),
  }),
  outputSchema: z.object({
    comment: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { scanResult, lang } = inputData;
    const prompt = `
# Language:
- You should speak and write in ${lang}.

# Background:
- Below scan result is our service security scan result. It may contain vulnerabilities detail URLs.

# Rules:
- The report should be in ${lang} and you should finish the code review in ${maxTurns} turns.
- You should also show us which URLs you opened and what you found in the URLs.
- Do not read raw lock file (yarn.lock, pnpm-lock.yaml...) as it it too large and bad affect to your context memory size.

# Your Task:
- You should read below scan result and open the detail URLs and read vulnerability details.
- You should create action list with consideration of each vulnerability risk level.
- You should search the application code (eg, .ts and .tsx files) where the vulnerability library is actually being used
  - You should search only files with have extension .ts or .tsx. (for speed up search)
  - Your should exclude files in node_modules, dist, build, and public directories.
  - If vulnerability library is actually being used, check whether it is exposed to an attack surface that can be exploited by crackers.

# Report Format:
- The report should be contain the following items:
  - Problematic package name
  - ID of vulnerability (CVE-ID, etc)
  - Severity of the vulnerability as classified by a public institution
  - Where the vulnerability is used in the actual app (file path)
  - Whether the implementation of the actual app is affected by the vulnerability
  - Details of the vulnerability

# Scan Result:
${scanResult}
`;

    const messages: SDKMessage[] = [];
    for await (const message of query({
      prompt,
      abortController: new AbortController(),
      options: {
        maxTurns,
        permissionMode: "bypassPermissions",
        appendSystemPrompt: `
You are a security expert. You can find vulnerabilities in code and provide detailed reports on potential security issues.
**IMPORTANT** You should speak and write in ${lang}.
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

trivyWorkflow.then(trivyScanStep).then(messageOutputStep).commit();

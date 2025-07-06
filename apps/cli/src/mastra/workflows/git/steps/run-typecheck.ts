import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_RUN_TYPECHECK = "step-run-build";

export const stepRunTypeCheck = createStep({
  id: STEP_RUN_TYPECHECK,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic to set up a branch
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

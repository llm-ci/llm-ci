import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_REMOVE_BRANCH = "step-remove-branch";

export const stepRemoveBranch = createStep({
  id: STEP_REMOVE_BRANCH,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic to set up a branch
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

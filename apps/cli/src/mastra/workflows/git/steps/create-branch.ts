import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_CREATE_BRANCH = "step-create-branch";

export const stepCreateBranch = createStep({
  id: STEP_CREATE_BRANCH,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic to set up a branch
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

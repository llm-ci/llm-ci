import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_GIT_PUSH = "step-git-push";

export const stepGitPush = createStep({
  id: STEP_GIT_PUSH,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic to set up a branch
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_REMOVE_WORKTREE = "step-remove-worktree";

export const stepRemoveWorktree = createStep({
  id: STEP_REMOVE_WORKTREE,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

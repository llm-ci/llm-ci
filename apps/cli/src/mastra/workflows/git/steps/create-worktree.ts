import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_CREATE_WORKTREE = "step-create-worktree";

export const stepCreateWorktree = createStep({
  id: STEP_CREATE_WORKTREE,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic to set up a worktree
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

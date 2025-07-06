import { createWorkflow } from "@mastra/core/workflows";
import { schemaGitWorktree } from "./schema";
import { stepRemoveBranch, stepRemoveWorktree } from "./steps";

export const WORKFLOW_TEARDOWN_WORKTREE = "workflow-teardown-worktree";

export const workflowTeardownWorktree = createWorkflow({
  id: WORKFLOW_TEARDOWN_WORKTREE,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  steps: [stepRemoveBranch, stepRemoveWorktree],
});

workflowTeardownWorktree
  .then(stepRemoveBranch)
  .then(stepRemoveWorktree)
  .commit();

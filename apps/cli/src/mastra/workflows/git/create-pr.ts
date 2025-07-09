import { createWorkflow } from "@mastra/core/workflows";
import { schemaGitWorktree } from "./schema";
import { stepGitCreatePR, stepGitPush } from "./steps";

export const WORKFLOW_CRATE_PR = "workflow-create-pr";

export const workflowCreatePR = createWorkflow({
  id: WORKFLOW_CRATE_PR,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  steps: [stepGitPush, stepGitCreatePR],
  retryConfig: {
    // avoid high network load in parallel mode
    attempts: 2,
    delay: 1000,
  },
});

workflowCreatePR.then(stepGitPush).then(stepGitCreatePR).commit();

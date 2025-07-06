import { createWorkflow } from "@mastra/core/workflows";
import {
  schemaGitWorktree,
  workflowCreatePP,
  workflowSetupWorktree,
  workflowTeardownWorktree,
} from "./git";

export const WORKFLOW_TS_PERF = "workflow-ts-perf";

export const workflowTsPerf = createWorkflow({
  id: WORKFLOW_TS_PERF,
  description: "Workflow to improve TypeScript performance",
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  // @ts-expect-error: exactOptionalPropertyTypes ref: https://github.com/mastra-ai/mastra/issues/3046
  steps: [workflowSetupWorktree, workflowCreatePP, workflowTeardownWorktree],
});

workflowTsPerf
  // @ts-expect-error: exactOptionalPropertyTypes ref: https://github.com/mastra-ai/mastra/issues/3046
  .then(workflowSetupWorktree)
  // @ts-expect-error: exactOptionalPropertyTypes ref: https://github.com/mastra-ai/mastra/issues/3046
  .then(workflowCreatePP)
  // @ts-expect-error: exactOptionalPropertyTypes ref: https://github.com/mastra-ai/mastra/issues/3046
  .then(workflowTeardownWorktree)
  .commit();

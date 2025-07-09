import { createWorkflow } from "@mastra/core/workflows";
import { schemaGitWorktree } from "./schema";
import {
  stepCreateBranch,
  stepCreateWorktree,
  stepRunBuild,
  stepRunPackageInstall,
  stepRunTypeCheck,
} from "./steps";

export const WORKFLOW_SETUP_WORKTREE = "workflow-setup-worktree";

export const workflowSetupWorktree = createWorkflow({
  id: WORKFLOW_SETUP_WORKTREE,
  description:
    "Create git worktree / git branch, run package install, build, and type checking)",
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  steps: [
    stepCreateWorktree,
    stepCreateBranch,
    stepRunPackageInstall,
    stepRunBuild,
    stepRunTypeCheck,
  ],
  retryConfig: {
    attempts: 2, // retry on failure (e.g. high network load in parallel mode)
    delay: 3000, // avoid high CPU usage on retry in parallel mode
  },
});

workflowSetupWorktree
  .then(stepCreateWorktree)
  .then(stepCreateBranch)
  .then(stepRunPackageInstall)
  .then(stepRunBuild)
  .then(stepRunTypeCheck)
  .commit();

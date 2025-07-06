import { createStep } from "@mastra/core/workflows";
import { schemaGitWorktree } from "../schema";

export const STEP_RUN_PACKAGE_INSTALL = "step-run-package-install";

export const stepRunPackageInstall = createStep({
  id: STEP_RUN_PACKAGE_INSTALL,
  inputSchema: schemaGitWorktree,
  outputSchema: schemaGitWorktree,
  execute: async ({ inputData }) => {
    // TODO: Implement the logic to set up a branch
    console.error("***** IMPLEMENT ME *****");

    return inputData;
  },
});

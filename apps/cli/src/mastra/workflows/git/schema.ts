import { z } from "zod";

export const schemaGitWorktree = z.object({
  worktreeName: z.string({
    description:
      "Name of the worktree (e.g., feature-branch. this will be used to create a path/to/worktrees/[worktreeName])",
  }),
  worktreeParentDir: z.string({
    description:
      "Directory where the worktree will be set up (e.g., /path/to/worktrees/)",
  }),
  gitBranchName: z.string({
    description:
      "Name of the git branch to create in the worktree (e.g., feature-branch1, this will be used to create a new branch in the git repository of the worktree)",
  }),
});

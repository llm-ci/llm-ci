import { Mastra } from "@mastra/core";
import { reviewWorkflow, trivyWorkflow, workflowTsPerf } from "./workflows";

export const mastra: Mastra = new Mastra({
  workflows: {
    reviewWorkflow,
    trivyWorkflow,
    workflowTsPerf,
  },
});

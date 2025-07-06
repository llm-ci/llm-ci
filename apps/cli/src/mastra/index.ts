import { Mastra } from "@mastra/core";
import { reviewWorkflow, trivyWorkflow, typescriptWorkflow } from "./workflows";

export const mastra: Mastra = new Mastra({
  workflows: {
    reviewWorkflow,
    trivyWorkflow,
    typescriptWorkflow,
  },
});

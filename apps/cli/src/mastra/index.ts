import { Mastra } from "@mastra/core";
import { reviewWorkflow, trivyWorkflow } from "./workflows";

export const mastra: Mastra = new Mastra({
  workflows: {
    reviewWorkflow,
    trivyWorkflow,
  },
});

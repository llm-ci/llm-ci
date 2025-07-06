import { Mastra } from "@mastra/core";
import { reviewWorkflow } from "./workflows";

export const mastra: Mastra = new Mastra({
  workflows: {
    reviewWorkflow,
  },
});

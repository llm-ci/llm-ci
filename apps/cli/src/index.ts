#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import {
  makeSecurityCommand,
  makeSentryCommand,
  makeTypescriptCommand,
} from "./commands";
import { mastra } from "./mastra";

// register mastra admin panel
mastra;

const program = new Command();
program.addCommand(makeSecurityCommand());
program.addCommand(makeSentryCommand());
program.addCommand(makeTypescriptCommand());

program.parse();

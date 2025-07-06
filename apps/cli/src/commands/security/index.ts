import { Command, Option } from "@commander-js/extra-typings";
import { mastra } from "../../mastra";

export const makeSecurityCommand = () => {
  const security = new Command("security");
  security.description("security related commands.");

  security
    .command("scan", { isDefault: true })
    .description("check security")
    .addOption(
      new Option(
        "-t, --target <string>",
        "target file path or directory to scan",
      ),
    )
    .addOption(
      new Option("-l, --lang <string>", "language of report")
        .choices(["en", "ja"])
        .default("en", "English"),
    )
    .action(async (options) => {
      const run = await mastra.getWorkflow("reviewWorkflow").createRunAsync();
      const result = await run.start({
        inputData: {
          lang: options.lang,
          target: options.target,
        },
      });

      if (result.status !== "success") {
        console.error(result.status, result);
        throw Error(result.status);
      }

      console.log("Report:", result.result.comment);
    });

  return security;
};

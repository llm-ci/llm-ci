import { Command, Option } from "@commander-js/extra-typings";

export const makeTypescriptCommand = () => {
  const typescript = new Command("typescript");
  typescript.description("typescript related commands.");

  typescript
    .command("scan", { isDefault: true })
    .description("check typescript")
    .addOption(
      new Option("-l, --lang <string>", "language of report")
        .choices(["en", "ja"])
        .default("en", "English"),
    )
    .action(async (options) => {
      console.log(options.lang);
    });

  return typescript;
};

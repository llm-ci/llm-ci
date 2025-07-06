import { Command, Option } from "@commander-js/extra-typings";

export const makeSecurityCommand = () => {
  const security = new Command("security");
  security.description("security related commands.");

  security
    .command("scan", { isDefault: true })
    .description("check security")
    .addOption(
      new Option("-l, --lang <string>", "language of report")
        .choices(["en", "ja"])
        .default("en", "English"),
    )
    .action(async (options) => {
      console.log(options.lang);
    });

  return security;
};

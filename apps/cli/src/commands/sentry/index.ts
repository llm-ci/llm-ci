import { Command, Option } from "@commander-js/extra-typings";

export const makeSentryCommand = () => {
  const sentry = new Command("sentry");
  sentry.description("sentry related commands.");

  sentry
    .command("scan", { isDefault: true })
    .description("check sentry")
    .addOption(
      new Option("-l, --lang <string>", "language of report")
        .choices(["en", "ja"])
        .default("en", "English"),
    )
    .action(async (options) => {
      console.log(options.lang);
    });

  return sentry;
};

import { Args, parse } from "https://deno.land/std@0.110.0/flags/mod.ts";

import * as watchCommand from "./commands/watch.ts";

const VERSION = "0.0.0";

interface Command {
  name: string;
  description: string;
  help: string;
  execute(args: Args): Promise<number>;
}

const commands: Command[] = [
  watchCommand,
];

const help = `pekoe v${VERSION}
Pekoe

Usage:
    pekoe <command> [...options]

Commands:
    ${
  commands.map(({ name, description }) => `${name.padEnd(15)}${description}`)
    .join("\n    ")
}
Options:
    -v, --version  Prints version number
    -h, --help     Prints help message
`;

async function execute(args: Args): Promise<number> {
  if (args.version) {
    const { deno, v8, typescript } = Deno.version;
    console.log([
      `pekoe ${VERSION}`,
      `deno ${deno}`,
      `v8 ${v8}`,
      `typescript ${typescript}`,
    ].join("\n"));
    return 0;
  }

  const subcommand = args._.shift();

  const nextCommand = commands.find((command) => command.name === subcommand);
  if (nextCommand) {
    const { help, execute } = nextCommand;
    if (args.help) {
      console.log(help);
      return 0;
    }

    return await execute(args);
  }

  console.log(help);
  return 0;
}

if (import.meta.main) {
  Deno.exit(await execute(parse(Deno.args)));
}

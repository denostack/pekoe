import { Args, parse } from "https://deno.land/std@0.110.0/flags/mod.ts";
import { watch } from "../core/watch.ts";

export const name = "watch";

export const description = "Watching";

export const help = `pekoe watch [entryfile]
Watching

Usage:
  pekoe watch ./entry.ts --port 3000

Options:
  host       hostname
  port       port (default: 3000)
`;

export async function execute(args: Args): Promise<number> {
  const entry = args._.shift();
  if (!entry) {
    console.log(help);
    return 1;
  }

  await watch({
    entry: `${entry}`,
    host: args.host,
    port: args.port,
  });
  return 0;
}

if (import.meta.main) {
  Deno.exit(await execute(parse(Deno.args)));
}

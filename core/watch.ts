import { serve } from "https://deno.land/std@0.110.0/http/server.ts";
import {
  extname,
  relative,
  resolve,
} from "https://deno.land/std@0.110.0/path/mod.ts";
import { types } from "./mime.ts";
import { yellow } from "https://deno.land/std@0.110.0/fmt/colors.ts";

import { createCompiler } from "./compiler.ts";
import { debounce } from "./utils.ts";
import { HTML } from "./base_html.ts";

export interface WatchOptions {
  entry: string;
  host?: string;
  port?: number;
}

export async function watch(options: WatchOptions) {
  const cwd = await Deno.cwd();
  const entry = relative(cwd, options.entry);
  const { files, compile } = await createCompiler({
    entry,
  });

  await compile();

  const debouncedCompile = debounce(compile);

  const watcher = Deno.watchFs(".");
  (async () => {
    for await (const event of watcher) {
      if (event.kind === "modify") {
        console.log(
          `${yellow("Watch")} ${
            event.paths.map((path) => relative(cwd, path)).join(", ")
          } updated`,
        );
        debouncedCompile();
      }
    }
  })();

  const listener = Deno.listen({
    hostname: options.host || undefined,
    port: options.port || 3000,
  });

  await serve(listener, async (request) => {
    const url = new URL(request.url);

    if (url.pathname === "/-/bundle.js" && files["deno:///bundle.js"]) {
      return new Response(files["deno:///bundle.js"], {
        status: 200,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
        },
      });
    } else if (
      url.pathname === "/-/bundle.js.map" && files["deno:///bundle.js.map"]
    ) {
      return new Response(files["deno:///bundle.js.map"], {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    } else if (url.pathname.startsWith("/-/")) {
      const filepath = resolve(entry, "..", url.pathname.substr(3));
      try {
        const stat = await Deno.stat(filepath);
        if (!stat.isFile) {
          return new Response("", { status: 404 });
        }

        return new Response(await Deno.readTextFile(filepath), {
          status: 200,
          headers: {
            "content-type": types.get(extname(filepath).substr(1)) ??
              "application/octet-stream",
          },
        });
      } catch (e) {
        // console.log("error occured", filepath);
      }
    }

    // TODO: static file
    // try {
    //   // const stat = await Deno.stat(filepath);
    //   // }
    // } catch (e) {
    //   // console.log("error occured", filepath);
    // }

    return new Response(HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  });
}

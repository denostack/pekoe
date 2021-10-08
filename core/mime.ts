import { db } from "https://deno.land/x/media_types@v2.3.7/db.ts";

export const extensions = new Map<string, string[]>();
export const types = new Map<string, string>();

const preference = ["nginx", "apache", undefined, "iana"];

for (const type of Object.keys(db)) {
  const mime = db[type];
  const exts = mime.extensions;

  if (!exts || !exts.length) {
    continue;
  }

  extensions.set(type, exts);

  for (const ext of exts) {
    const current = types.get(ext);
    if (current) {
      const from = preference.indexOf(db[current].source);
      const to = preference.indexOf(mime.source);

      if (
        current !== "application/octet-stream" &&
        (from > to ||
          (from === to && current.substr(0, 12) === "application/"))
      ) {
        continue;
      }
    }

    types.set(ext, type);
  }
}

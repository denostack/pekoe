import { green, red } from "https://deno.land/std@0.110.0/fmt/colors.ts";

export interface CompilerOptions {
  entry: string;
}

const encoder = new TextEncoder();

async function assertFile(file: string) {
  try {
    const stat = await Deno.stat(file);
    if (stat.isFile) {
      return;
    }
  } catch {
    //
  }
  throw new Error(`${file} is not a file`);
}

export async function createCompiler(options: CompilerOptions) {
  const fileCache = {} as Record<string, string>;

  await assertFile(options.entry);

  async function compile() {
    console.log(`${green("Compile")} ${options.entry} start...`);

    try {
      // https://github.com/denoland/deno/blob/77a00ce1fb4ae2523e22b9b84ae09a0200502e38/cli/ops/runtime_compiler.rs
      const { files } = await Deno.emit(options.entry, {
        bundle: "module",
        check: false,
        compilerOptions: {
          lib: ["dom"],
        },
      });
      for (const [file, body] of Object.entries(files)) {
        fileCache[file] = body;
      }

      console.log(`${green("Compile")} complete!`);
    } catch (e: any) {
      console.log(`${red("Compile Error")} ${e.message}`);
    }
  }

  return {
    files: fileCache,
    compile,
  };
}

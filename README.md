# pekoe

Build the deno web project with deno.

This is an experimental project inspired by vite.

## Usage

create `example.tsx` file.

```tsx
/// <reference lib="dom" />
import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

function Home() {
  return (
    <div>
      <h1>Hello World!!!</h1>
    </div>
  );
}

const div = document.createElement("div");
document.body.append(div);

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  div,
);
```

run,

```bash
deno run -A --unstable https://deno.land/x/pekoe/cli.ts watch example.tsx
```

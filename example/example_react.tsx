/// <reference lib="dom" />

import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

// https://web.dev/css-module-scripts/
const sheet = await import("/-/home.css", {
  assert: { type: "css" },
}).then(({ default: sheet }: { default: CSSStyleSheet }) => sheet);

document.adoptedStyleSheets = [sheet];

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

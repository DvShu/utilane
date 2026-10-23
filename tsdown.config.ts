import { defineConfig, type UserConfigExport } from "tsdown";

const config: UserConfigExport = defineConfig({
  entry: {
    index: "./src/index.ts",
    node: "./src/node.ts",
    browser: "./src/browser.ts",
  },
  exports: true,
  dts: true,
  outDir: "./lib",
  platform: "neutral",
  target: "es2020",
  deps: {
    neverBundle: [/^node:/],
  },
});

export default config;

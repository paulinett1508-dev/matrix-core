// Marca dist/cjs como CommonJS (o package raiz é type:module).
import { writeFileSync, mkdirSync } from "node:fs";
const dir = new URL("../dist/cjs/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("package.json", dir), JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
console.log("dist/cjs/package.json (type:commonjs)");

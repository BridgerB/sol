import rawDeployConfig from "./.deno-deploy/deploy.json" with { type: "json" };
import rawSvelteData from "./.deno-deploy/svelte.json" with { type: "json" };
import { prepareServer } from "./.deno-deploy/handler.ts";

const handler = prepareServer(rawSvelteData, rawDeployConfig, Deno.cwd());

const port = parseInt(Deno.env.get("PORT") || "8080");
Deno.serve({ port }, handler);

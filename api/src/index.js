import { serve } from "@hono/node-server";
import { createApp } from "./app/create-app.js";
import { env } from "./config/env.js";

serve(
  {
    fetch: createApp().fetch,
    port: env.port,
  },
  (info) => {
    console.log(`API listening on http://localhost:${info.port}`);
  },
);

import { Elysia } from "elysia";
import fragments from "./api/fragments";
import api from "./api";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'



export const app = new Elysia()
  .use(api)
  .use(fragments)
  .use(staticPlugin({ assets: "./src/assets", prefix: "/i" }))
  .use(html())
  .use(swagger())
  .get("/", () => Bun.file("./src/index.html").text())




app.listen(3572);


console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

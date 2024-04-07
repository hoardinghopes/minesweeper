import Elysia from "elysia";
import { config } from "../config";
import pretty from "pino-pretty";
import { HoltLogger } from "@tlscipher/holt";
import { MinesweeperDB } from "../db";

const stream = pretty({
    colorize: true,
});

const loggerConfig =
    config.env.NODE_ENV === "development"
        ? {
            level: config.env.LOG_LEVEL,
            stream,
        }
        : { level: config.env.LOG_LEVEL };

export const ctx = new Elysia({
    name: "@app/ctx",
})
    .decorate('db', new MinesweeperDB())
    .decorate("config", config)
    .use(new HoltLogger().getLogger());


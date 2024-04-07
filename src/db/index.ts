import { drizzle } from "drizzle-orm/libsql";
import { type SelectUser, scores, users } from "./schema";
import { asc, eq } from "drizzle-orm";
import { config } from "../config";
import { type Config, createClient } from "@libsql/client";
import * as schema from "./schema";

const { DATABASE_CONNECTION_TYPE } = config.env;

const options = {
    local: { url: "file:local.sqlite" },
    remote: {
        url: config.env.DATABASE_URL,
        authToken: config.env.DATABASE_AUTH_TOKEN,
    }
} satisfies Record<typeof DATABASE_CONNECTION_TYPE, Config>;

export class MinesweeperDB {

    private db;
    constructor() {
        const client = createClient(options.remote);
        this.db = drizzle(client, { schema, logger: false });
    }

    getDB() {
        return this.db;
    }

    async getUsers() {
        const result = await this.db.select().from(users).all();
        return result;
    }

    async addUser(name: string) {
        const result = await this.db
            .insert(users)
            .values({ name })
            .returning()
            .get();
        return result;
    }

    async updateUser(userID: number, newName: string) {
        const result = await this.db
            .update(users)
            .set({ name: newName })
            .where(eq(users.id, userID))
            .returning()
            .get();
        return result;
    }


    async deleteUser(userID: SelectUser['id']): Promise<boolean> {
        const result = await this.db
            .delete(users)
            .where(eq(users.id, userID))
            .returning()
            .get();
        if (result) {
            return true;
        }
        console.error(`deleteUser(${userID}): User not found`);
        return false;
    }

    async getUser(userID: SelectUser['id']) {
        const result = await this.db
            .select()
            .from(users)
            .where(eq(users.id, userID))
            .limit(1)
            .get();
        return result;
    }



    async getScores() {

        const rows = await this.db.select({
            user: users.name,
            userID: users.id,
            timeCompleted: scores.timeCompleted,
            createdAt: scores.createdAt,
            scoreID: scores.id
        }).from(scores).leftJoin(users, eq(scores.userId, users.id)).orderBy(asc(scores.timeCompleted)).limit(10).all();


        if (!rows) {
            console.error("No scores found");
            return { error: "No scores found" };
        }

        const result = [];
        for (const row of rows) {

            if (!row.userID) continue; // if user has been deleted but it didn't cascade to delete their scores

            result.push({
                user: row.user,
                userID: row.userID,
                timeCompleted: row.timeCompleted,
                createdAt: row.createdAt,
                scoreID: row.scoreID
            });
        }

        return result;
    }

    async getScoresByLevel(level: 'beginner' | 'intermediate' | 'expert') {

        const rows = await this.db.select({
            user: users.name,
            userID: users.id,
            timeCompleted: scores.timeCompleted,
            createdAt: scores.createdAt,
            scoreID: scores.id
        }).from(scores).where(eq(scores.level, level)
        ).leftJoin(users, eq(scores.userId, users.id)).orderBy(asc(scores.timeCompleted)).limit(10).all();


        if (!rows) {
            console.error("No scores found");
            return { error: "No scores found" };
        }

        const result = [];
        for (const row of rows) {

            if (!row.userID) continue; // if user has been deleted but it didn't cascade to delete their scores

            result.push({
                user: row.user,
                userID: row.userID,
                timeCompleted: row.timeCompleted,
                createdAt: row.createdAt,
                scoreID: row.scoreID
            });
        }

        return result;
    }

    async addScore(timeCompleted: number, userID: number, level: 'beginner' | 'intermediate' | 'expert') {
        if (!timeCompleted) {
            throw new Error(`No timeCompleted provided or wrong format: ${timeCompleted}`);
        }

        const result = await this.db
            .insert(scores)
            .values({ timeCompleted, userId: userID, level })
            .returning()
            .get();
        return result;
    }

    async deleteScore(scoreID: number) {
        const result = await this.db
            .delete(scores)
            .where(eq(scores.id, scoreID))
            .returning()
            .get();
        return result;
    }

}
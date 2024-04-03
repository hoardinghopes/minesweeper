import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { scores, users } from "./schema";
import { asc, desc, eq } from "drizzle-orm";

// export default

export class MinesweeperDB {

    private db;
    constructor() {
        this.db = drizzle(new Database('./data/minesweeper.db'));
    }


    async getScores() {
        const rows = await this.db.select().from(scores).leftJoin(users, eq(users.id, scores.userId)).orderBy(asc(scores.timeCompleted)).all();

        if (!rows) {
            console.error("No scores found");
            return { error: "No scores found" };
        }

        const result = rows.map(row => {
            return {
                user: row.users?.name,
                userID: row.users?.id,
                timeCompleted: row.scores.timeCompleted,
                scoreID: row.scores.id
            };
        });

        console.log(result);

        return result;
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

    async updateUser(newName: string, oldName: string, id: number) {
        const result = await this.db
            .update(users)
            .set({ name: newName })
            .where(eq(users.name, oldName))
            .returning()
            .get();
        return result;
    }

    async addScore(timeCompleted: number, userName: string) {
        const user = await this.db
            .select()
            .from(users)
            .where(eq(users.name, userName))
            .limit(1)
            .get();

        if (!user) {
            throw new Error("User not found");
        }

        const result = await this.db
            .insert(scores)
            .values({ timeCompleted, userId: user.id })
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
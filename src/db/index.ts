import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { type SelectUser, scores, users } from "./schema";
import { asc, eq } from "drizzle-orm";


export class MinesweeperDB {

    private db;
    constructor() {
        this.db = drizzle(new Database('./data/minesweeper.db'));
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

    async confirmOrAddUser(name: string) {
        const result = await this.db
            .select()
            .from(users)
            .where(eq(users.name, name))
            .limit(1)
            .get();

        console.log(`User ${name} exists: `, result);

        let user = result;
        if (!user) {
            user = await this.addUser(name);
            console.log(`User ${name} added: `, user);
        }
        return user;
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
        console.log(`deleteUser(${userID}): User not found`);
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

        // console.log(rows);


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

    async addScore(timeCompleted: number, userID: number) {
        console.log(`addScore: ${timeCompleted} ${userID}`);
        // const existingUser = await this.confirmOrAddUser(userID);

        // console.log(`User (${userID}):`, existingUser);

        // const user = await this.db
        //     .select()
        //     .from(users)
        //     .where(eq(users.name, userID))
        //     .limit(1)
        //     .get();

        // if (!user) {
        //     throw new Error("User not found");
        // }

        const result = await this.db
            .insert(scores)
            .values({ timeCompleted, userId: userID })
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
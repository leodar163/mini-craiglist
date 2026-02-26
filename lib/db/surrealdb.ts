import {Surreal, Table} from "surrealdb";

export const DBTables = {
    user: new Table("user"),
    session: new Table("session"),
}

export async function getDB() {
    const db = new Surreal();

    try {
        await db.connect("ws://127.0.0.1:8000/rpc", {
            namespace: "minicraig-list",
            database: "all",
            authentication: {
                username: "root",
                password: "root",
            }
        });
    }
    catch (error) {
        console.error("❌ DB connection error:", error);
        await db.close();
    }

    return db;
}
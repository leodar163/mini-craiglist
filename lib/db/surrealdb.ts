import {Surreal} from "surrealdb";

const globalForDB = globalThis as unknown as {
    db: Surreal | null;
    dbPromise: Promise<void> | null;
};

export const db = globalForDB.db ?? new Surreal();

if (!globalForDB.db) {
    globalForDB.db = db;
}

export async function connectDB() {
    if (!globalForDB.dbPromise) {
        globalForDB.dbPromise = (async () => {
            try {
                await db.connect("http://127.0.0.1:8000/rpc");

                await db.signin({
                    username: "root",
                    password: "root",
                });

                await db.use({
                    namespace: "minicraig-list",
                    database: "all",
                });
            }
            catch (error) {
                console.error(error);
                await db.close();
            }

            console.log("✅ SurrealDB connected");
        })();
    }

    return globalForDB.dbPromise;
}
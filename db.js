import { LowSync, JSONFileSync } from "lowdb";

const isDev = process.env.NODE_ENV !== "production";

const db = new LowSync(new JSONFileSync(isDev ? "db.json" : "tmp/db.json"));
db.read();

export default db;

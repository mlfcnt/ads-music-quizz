import { LowSync, JSONFileSync } from "lowdb";

const db = new LowSync(new JSONFileSync("db.json"));
db.read();

export default db;

import { LowSync, JSONFileSync } from "lowdb";

const db = new LowSync(new JSONFileSync("tmp/db.json"));
db.read();

export default db;

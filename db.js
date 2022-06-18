import { LowSync, JSONFileSync } from "lowdb";
import path from "path";

const file = path.join(process.cwd(), "public", "db.json");
const db = new LowSync(new JSONFileSync(file));

db.read();

export default db;

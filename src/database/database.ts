import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(__dirname, "../../database.db");
const schemaPath = path.resolve(__dirname, "./schema.sql");

const db = new Database(dbPath);

const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);

export default db;
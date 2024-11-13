import pkg from "pg";
const { Pool } = pkg;
import env from "dotenv";

// Environmental Variable Config

env.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_ACCESS,
  port: 5432,
});

export default pool;

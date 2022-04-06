import { Pool } from "pg";
import { config } from "dotenv";
config();

export class DbConfig {
  constructor() {
    this.pool = new Pool({
      connectionString: "postgres://vnfqovug:5a3ZNX4VjMXnaih8I0oelsjSE5w9mtYR@john.db.elephantsql.com/vnfqovug",
    });
  }

  getPool() {
    return this.pool;
  }
}

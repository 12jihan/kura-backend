import { Pool, type PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

// postgresql://{user}:{password}@{host}:{port}/{dbname}
//
// let config: PoolConfig;
// config.host;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT ?? '5433', 10),
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_NAME,
});

export default pool;

// export type CardStatus = 'active' | 'dismissed' | 'scheduled' | 'posted';
//
// export interface Card {
//   id: string;
//   user_id: string;
//   content: string;
//   original_content: string;
//   status: CardStatus;
//   created_at: string;
//   updated_at: string;
//   platform: string;
//   is_edited: boolean;
// }

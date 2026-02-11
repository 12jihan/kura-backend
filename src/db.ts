import { Pool, type PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

// postgresql://{user}:{password}@{host}:{port}/{dbname}
//
// let config: PoolConfig;
// config.host;

const pool = new Pool({
  host: process.env.PG_HOST,
  // port: Number(process.env.PG_PORT),
  port: 5433,
  user: process.env.PG_USER,
  database: process.env.PG_NAME,
  password: process.env.PG_PASS,
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



import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import cors from "cors";
import pool from "./db.js";

import health_routers from './routes/health/health.routes.js';
import cards_routers from './routes/cards/cards.routes.js';
import users_routers from './routes/users/users.routes.js';
import posts_routers from './routes/posts/posts.routes.js';

const app = express();
const PORT = 3000;

// FOR TESTING TO SEE WHAT IT'S RECEIVING
// app.use((req, res, next) => {
//   // console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}  →  req.url=${req.url}`);
//   next();
// });

app.use(express.json());
app.use(cors());

app.use("api/v1", health_routers);
app.use("api/v1", users_routers);
app.use("api/v1", cards_routers);
app.use("api/v1", posts_routers);

// app.get("/api/cards", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const query = `
//       SELECT
//         id,
//         user_id,
//         content,
//         original_content,
//         platform,
//         status,
//         is_edited,
//         created_at,
//         updated_at
//       FROM cards
//       ORDER BY created_at DESC
//     `;
//     const results = await pool.query(query);
//     // console.log("Results:\n", results.rows);
//
//     res.json({ message: "success", data: results.rows });
//   } catch (err) {
//     console.log("there was an error!", err);
//     res.status(500).json({
//       error: "failed",
//       message: err,
//     });
//   }
// });

// app.get("/api/cards/generate:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const query = `
//       SELECT
//         id,
//         user_id,
//         content,
//         original_content,
//         platform,
//         status,
//         is_edited,
//         created_at,
//         updated_at
//       FROM cards
//       ORDER BY created_at DESC
//     `;
//     const results = await pool.query(query);
//     console.log("Results:\n", results.rows);
//
//     res.json({ message: "success", data: results.rows });
//   } catch (err) {
//     console.log("there was an error!", err);
//     res.status(500).json({
//       error: "failed",
//       message: err,
//     });
//   }
// });


// I don't think that this will be needed at all
// app.get("/api/profile", async (req, res): Promise<unknown> => {
//   const _req = req.body;
//   console.log("current body", _req);
//   const _step = _req["step"];
//   const _data = _req["data"];
//   const _fbuid = [_req["data"]["firebase_uid"]];
//
//   console.log("step:", _step);
//   console.log("req:", _req);
//   console.log("data:", _data);
//
//   const query = `
//     SELECT 
//       handle,
//       content_type,
//       brand_description,
//       keywords,
//       onboarding_step,
//       onboarding_complete,
//       firebase_uid,
//       email
//     FROM profiles
//     WHERE firebase_uid = $1
//   `;
//
//   try {
//     const results = await pool.query(query, _fbuid);
//     console.log("results:\n", results.rows);
//     return res.status(200).json({ message: "success", body: req.body });
//   } catch (err: unknown) {
//     console.error(err);
//     return res.status(401).json({ message: err });
//   }
// });

app.post("/api/profile/onboard", async (req, res): Promise<unknown> => {
  const _req = req.body;
  const _step = _req["step"];
  const _data = _req["data"];

  const query = `
    INSERT INTO profiles (
      handle,
      content_type,
      brand_description,
      keywords,
      onboarding_step,
      onboarding_complete,
      firebase_uid,
      email
    )
    VALUES($1,$2,$3,$4,$5,$6,$7, $8)
    RETURNING *
  `;
  const values: any = [
    _data["handle"],
    _data["content_type"],
    _data["brand_description"],
    _data["keywords"],
    _data["onboarding_step"],
    _data["onboarding_complete"],
    _data["firebase_uid"],
    _data["email"],
  ];
  // console.log("the value of them all", values);

  try {
    let results = await pool.query(query, values);
    results = results.rows[0];

    return res.status(200).json({ message: "success", body: results });
  } catch (err: unknown) {
    console.error(err);

    return res.status(401).json({ message: err });
  }
});

app.post("/posts", async (req: Request, res: Response): Promise<void> => {
  try {
    const yup: Request = req.body;
    const query = `
      INSERT INTO documents (
        text, 
        link, 
        hashtags, 
        embedding
      )
      VALUES($1,$2,$3,$4)
      RETURNING *
    `;
    let testarr: any = Array(768).fill(0.001);
    testarr = "[" + testarr.toString() + "]";
    const values: [string, string, string[], any] = [
      "testing",
      "https://www.example.com/",
      ["hola"],
      testarr,
    ];
    const results = await pool.query(query, values);
    console.log("results:\n", results.rows);

    res.status(200).json({ message: "success", data: results.rows });
  } catch (err) {
    res.status(500).json({
      error: 500,
      message: err,
    });
  }
});

app.delete("/post", async (req: Request): Promise<void> => {
  const _req: Request = req.body;
  console.log("request: ", _req);
});

app.listen(PORT, (error) => {
  if (error) return;

  console.log("listening on port http://localhost:3000/");
});

import express, { type Request, type Response } from "express";
import cors from "cors";
import pool from "./db.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/posts", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT id, text, hashtags, created_at, modified_at, posted, deleted 
      FROM documents 
      ORDER BY id ASC
    `;
    const results = await pool.query(query);
    console.log("Results:\n", results.rows);

    res.json({ message: "posted", data: results.rows });
  } catch (err) {
    console.log("there was an error!", err);
    res.status(500).json({
      error: "500",
      message: err,
    });
  }
});

app.get("/api/cards", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT 
        id, 
        user_id, 
        content, 
        original_content, 
        status, 
        created_at,  
        updated_at, 
        platform,
        is_edited
      FROM documents 
    `;
    const results = await pool.query(query);
    console.log("Results:\n", results.rows);

    res.json({ message: "posted", data: results.rows });
  } catch (err) {
    console.log("there was an error!", err);
    res.status(500).json({
      error: "500",
      message: err,
    });
  }
});

app.get("/api/user", async (req, res) => {
  const _req = req.query;

  const _query: string = `
    SELECT *
    FROM profiles
    WHERE firebase_uid = '${_req.uid}'
  `

  try {
    if (!_req.uid) throw Error("UID was not provided");
    const results = await pool.query(_query);
    const data = results.rows[0];
    console.log("query results", data);

    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(401).json({ status: "error", message: err })
  }
});

app.post("/api/profile/onboard", async (req, res): Promise<unknown> => {

  const _req = req.body;
  const _step = _req['step'];
  const _data = _req['data'];

  console.log("request:", _req);
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
    _data['handle'],
    _data['content_type'],
    _data['brand_description'],
    _data['keywords'],
    _data['onboarding_step'],
    _data['onboarding_complete'],
    _data['firebase_uid'],
    _data['email']
  ];
  // console.log("the value of them all", values);

  try {
    const results = await pool.query(query, values);
    console.log("results:\n", results.rows);
    return res.status(200).json({ message: "success", body: req.body });
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
})

app.listen(PORT, (error) => {
  if (error) return;

  console.log("listening on port http://localhost:3000/");
});

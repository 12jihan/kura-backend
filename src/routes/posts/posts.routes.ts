import express from "express";
import pool from "../../db.js";
import { type Request, type Response } from "express";

const router = express.Router();

// TODO: figure this out because as of now this route doesn't make any sense the way that it's built 

router.post("/posts", async (req: Request, res: Response): Promise<void> => {
  try {
    // const yup: Request = req.body;
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

export default router;

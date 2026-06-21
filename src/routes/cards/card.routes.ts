import express from 'express';
import pool from "../../db.js";

const router = express.Router();

router.get("/api/cards", async (req, res): Promise<void> => {
  try {
    const query = `
      SELECT
        id,
        user_id,
        content,
        original_content,
        platform,
        status,
        is_edited,
        created_at,
        updated_at
      FROM cards
      ORDER BY created_at DESC
    `;
    const results = await pool.query(query);
    // console.log("Results:\n", results.rows);

    res.json({ message: "success", data: results.rows });
  } catch (err) {
    console.log("there was an error!", err);
    res.status(500).json({
      error: "failed",
      message: err,
    });
  }
});

router.post('/api/cards/generate', async (req, res): Promise<void> => {
  try {
    console.log("it hit the generate route...");
    res.status(200).json({
      message: "success",
      data: ""
    });

  } catch (err) {
    console.error("Route Error:", err);
    res.status(400).json({
      message: "failed",
      error: err
    });
  }
});

export default router;

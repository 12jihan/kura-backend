import express from 'express';
import pool from "../../db.js";

const router = express.Router();
router.get("/api/user", async (req, res) => {
  const _req = req.query;

  console.log("[/api/user]:", _req);
  const _query: string = `
    SELECT *
    FROM profiles
    WHERE firebase_uid = '${_req.uid}'
  `;

  try {
    if (!_req.uid) throw Error("UID was not provided");
    const results = await pool.query(_query);
    const data = results.rows[0];
    console.log("query results:", data);

    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(401).json({ status: "error", message: err });
  }
});

export default router;

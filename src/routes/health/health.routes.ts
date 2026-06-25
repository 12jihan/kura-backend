import express, { type Request, type Response } from 'express';
// import pool from "../../db.js";

const router = express.Router();

router.get("/health", async (req: Request, res: Response): Promise<void> => {
  console.log("Health check test");
  try {
    res.status(200).json({
      status: "success",
      message: "This was successful and health looks great",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
});

export default router;

import express from 'express';
import GeminiExt from '../gemini/GeminiExt.js';


const router = express.Router();
const aiService = new GeminiExt();

router.post('/api/cards/generate', async (req, res): Promise<void> => {
  try {
    const { topic = "Tech" } = req.body;
    const draftsArray = await aiService.find_article(topic);

    res.status(200).json({
      message: "success",
      data: draftsArray
    });
  } catch (err) {
    console.error("Route Error:", err);
    res.json({
      message: "failed",
      error: err
    });
  }
});

export default router;

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = process.env.YT_API_KEY;

/**
 * Fetch videos from a YouTube playlist (Muse India)
 */
app.get("/api/playlist", async (req, res) => {
  const playlistId = req.query.playlistId;

  if (!playlistId) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  const url =
    "https://www.googleapis.com/youtube/v3/playlistItems" +
    "?part=snippet" +
    `&playlistId=${playlistId}` +
    "&maxResults=50" +
    `&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

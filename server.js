import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = process.env.YT_API_KEY;

// 🔴 OFFICIAL Muse India Channel ID
const MUSE_CHANNEL_ID = "UCYYhAzgWuxPauRXdPpLAX3Q";

/**
 * 1️⃣ Get ALL playlists from Muse India channel
 * This is your "Anime List"
 */
app.get("/api/playlists", async (req, res) => {
  const url =
    "https://www.googleapis.com/youtube/v3/playlists" +
    "?part=snippet" +
    `&channelId=${MUSE_CHANNEL_ID}` +
    "&maxResults=50" +
    `&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

/**
 * 2️ Get ALL videos from a specific playlist
 * This is your "Episodes Page"
 */
app.get("/api/playlist-items", async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch playlist items" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ==========================
   BASIC MIDDLEWARE
========================== */
app.use(cors());
app.use(express.json());

/* ==========================
   CONSTANTS
========================== */
const YT_API_KEY = process.env.YT_API_KEY;
const MUSE_CHANNEL_ID = "UCYYhAzgWuxPauRXdPpLAX3Q"; // Muse India

if (!YT_API_KEY) {
  console.error(" ERROR: YT_API_KEY not set in environment variables");
}

/* ==========================
   HEALTH CHECK
========================== */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "youtube-anime-server",
  });
});

/* ==========================
   1️⃣ SEARCH PLAYLIST BY ANIME NAME
   (Used for WATCH NOW / STREAM OPTIONS)
========================== */
app.get("/api/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet&type=playlist&maxResults=1` +
    `&channelId=${MUSE_CHANNEL_ID}` +
    `&q=${encodeURIComponent(query)}` +
    `&key=${YT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      return res.json(null);
    }

    // Return first playlist or null
    res.json(data.items?.[0] || null);
  } catch (err) {
    console.error("Search API failed:", err);
    res.json(null);
  }
});

/* ==========================
   2️⃣ GET ALL PLAYLISTS FROM MUSE INDIA
   (Used for all-anime / indexing)
========================== */
app.get("/api/playlists", async (req, res) => {
  const url =
    "https://www.googleapis.com/youtube/v3/playlists" +
    `?part=snippet&maxResults=50` +
    `&channelId=${MUSE_CHANNEL_ID}` +
    `&key=${YT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      return res.status(500).json({ error: "YouTube API error" });
    }

    res.json(data);
  } catch (err) {
    console.error("Playlists API failed:", err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

/* ==========================
   SERVER START
========================== */
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});


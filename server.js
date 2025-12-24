import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 Your YouTube API key
const YT_API_KEY = process.env.YT_API_KEY || "YOUR_API_KEY_HERE";

// Allow frontend access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

/* ===========================
   GET ALL MUSE PLAYLISTS
=========================== */
app.get("/api/playlists", async (req, res) => {
  try {
    const channelId = "UCYYhAzgWuxPauRXdPpLAX3Q"; // Muse India

    const url =
      `https://www.googleapis.com/youtube/v3/playlists` +
      `?part=snippet&channelId=${channelId}&maxResults=50&key=${YT_API_KEY}`;

    const r = await fetch(url);
    const data = await r.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

/* ===========================
   ✅ GET PLAYLIST VIDEOS
=========================== */
app.get("/api/playlist-items", async (req, res) => {
  const { playlistId } = req.query;

  if (!playlistId) {
    return res.status(400).json({ error: "playlistId required" });
  }

  try {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YT_API_KEY}`;

    const r = await fetch(url);
    const data = await r.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch playlist items" });
  }
});

/* ===========================
   START SERVER
=========================== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

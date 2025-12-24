import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Put your YouTube API key in Render ENV
const YT_API_KEY = process.env.YT_API_KEY;

// CORS (simple + safe)
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

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

/* ===========================
   GET PLAYLIST VIDEOS
=========================== */
app.get("/api/playlist-items", async (req, res) => {
  const { playlistId } = req.query;

  if (!playlistId) {
    return res.status(400).json({ error: "playlistId is required" });
  }

  try {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YT_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlist items" });
  }
});

/* ===========================
   START SERVER
=========================== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

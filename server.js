import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const YT_API_KEY = process.env.YT_API_KEY;
const MUSE_CHANNEL_ID = "UCYYhAzgWuxPauRXdPpLAX3Q"; // Muse India

if (!YT_API_KEY) {
  console.error(" YT_API_KEY is missing");
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "youtube-anime-api",
  });
});

/* =========================
   SEARCH PLAYLIST BY QUERY
   (Reliable availability check)
========================= */
app.get("/api/search", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: "Missing query parameter",
    });
  }

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet&type=playlist&maxResults=1` +
    `&channelId=${MUSE_CHANNEL_ID}` +
    `&q=${encodeURIComponent(q)}` +
    `&key=${YT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("YouTube API error:", data.error);
      return res.json({
        success: false,
        error: "YouTube API error",
      });
    }

    if (data.items && data.items.length > 0) {
      return res.json({
        success: true,
        playlist: data.items[0],
      });
    }

    return res.json({
      success: false,
      playlist: null,
    });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({
      success: false,
      error: "Server fetch failed",
    });
  }
});

/* =========================
   GET ALL MUSE PLAYLISTS
   (Handles pagination)
========================= */
app.get("/api/playlists", async (req, res) => {
  let playlists = [];
  let pageToken = "";

  try {
    do {
      const url =
        "https://www.googleapis.com/youtube/v3/playlists" +
        `?part=snippet&maxResults=50` +
        `&channelId=${MUSE_CHANNEL_ID}` +
        `&key=${YT_API_KEY}` +
        (pageToken ? `&pageToken=${pageToken}` : "");

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error("YouTube API error:", data.error);
        return res.status(500).json({
          success: false,
          error: "YouTube API error",
        });
      }

      playlists = playlists.concat(data.items || []);
      pageToken = data.nextPageToken || "";
    } while (pageToken);

    res.json({
      success: true,
      count: playlists.length,
      items: playlists,
    });
  } catch (err) {
    console.error("Playlist fetch failed:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch playlists",
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

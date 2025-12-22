import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = process.env.YT_API_KEY;

//  CONFIRMED Muse India channel ID
const MUSE_CHANNEL_ID = "UCYYhAzgWuxPauRXdPpLAX3Q";

app.get("/api/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet` +
    `&channelId=${MUSE_CHANNEL_ID}` +
    `&q=${encodeURIComponent(query)}` +
    `&type=video` +
    `&maxResults=25` +
    `&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "YouTube API failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

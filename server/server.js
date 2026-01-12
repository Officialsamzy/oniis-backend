const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// Railway REQUIRED
const PORT = process.env.PORT || 3000;

// Telegram credentials from Railway ENV
const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Onii’s Log Backend is running ✅");
});

app.post("/notify", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message required" });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML"
        })
      }
    );

    const data = await response.json();

    if (data.ok) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: data.description });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

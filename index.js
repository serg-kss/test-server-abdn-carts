import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем только твой домен Хорошопа
app.use(cors({
  origin: "http://shop526862.horoshop.ua/", // поменяй на свой домен
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

// SendPulse credentials
const CLIENT_ID = process.env.SENDPULSE_ID;
const CLIENT_SECRET = process.env.SENDPULSE_SECRET;

let tokenCache = { token: null, expires: 0 };

async function getToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expires > now) return tokenCache.token;

  const res = await fetch("https://api.sendpulse.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expires: now + data.expires_in * 1000,
  };
  return tokenCache.token;
}

app.post("/cart-abandoned", async (req, res) => {
  const { email, cart_url } = req.body;
  if (!email || !cart_url) {
    return res.status(400).json({ error: "Missing email or cart_url" });
  }

  try {
    const token = await getToken();

    // Отправляем событие в SendPulse
    
    await fetch("https://events.sendpulse.com/events/name/abandoned_shopping_cart_1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        cart_url: cart_url ,
      }),
    });
    
    res.json({ success: true });
  } catch (e) {
    console.error("Error sending event:", e);
    res.status(500).json({ error: "Failed to send event" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

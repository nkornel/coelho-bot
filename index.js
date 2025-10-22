import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Fallback quotes for when OpenAI is unavailable
const fallbackQuotes = [
  "Az elme minden. Amit gondolsz, azzá válsz. — Buddha",
  "Amikor valamit igazán akarsz, az egész univerzum összefog, hogy segítsen elérni. — Paulo Coelho",
  "A csend Isten nyelve. Minden más csak gyenge fordítás. — Rumi",
  "A seb az a hely, ahol a Fény belép hozzád. — Rumi",
  "Nem te vagy egy csepp az óceánban. Te vagy az egész óceán egy cseppben. — Rumi",
  "Az élet ott kezdődik, ahol a félelem véget ér. — Osho",
  "Ha ellenállsz a változásnak, magának az életnek állsz ellen. — Sadhguru",
  "A jelen pillanat az egyetlen idő, ami létezik. — Eckhart Tolle",
  "A lélek mindig tudja, hogyan gyógyítsa meg önmagát. A kihívás az, hogy elcsendesítsd az elmét. — Caroline Myss",
  "Ne félj újrakezdeni. Ez egy lehetőség valami jobbat építeni. — Ismeretlen",
  "Minél többet engedsz el, annál magasabbra emelkedsz. — Ismeretlen",
  "Sár nélkül nincs lótusz. — Thich Nhat Hanh"
];

// Configure OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple per-user cooldown map to avoid spamming the API
const cooldownMs = 5000; // 5 seconds per user
const lastRequestAt = new Map();

// Use clientReady instead of the deprecated ready event (discord.js v15 rename)
client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Validate required environment variables early so errors are clearer
const missingEnv = [];
if (!process.env.DISCORD_TOKEN) missingEnv.push("DISCORD_TOKEN");
if (!process.env.QUOTE_CHANNEL_ID) missingEnv.push("QUOTE_CHANNEL_ID");
if (missingEnv.length) {
  console.error(
    `Missing required environment variables: ${missingEnv.join(", ")}. Please add them to your .env file.`
  );
  // Don't attempt to login if critical env vars are missing
  process.exitCode = 1;
}

// Global error handlers for cleaner output during runs
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

client.on("messageCreate", async (message) => {
  try {
    // Ignore bot messages and DMs
    if (message.author.bot || !message.guild) return;

    // Only respond in the designated channel
    if (message.channel.id !== process.env.QUOTE_CHANNEL_ID) return;

    // Cooldown check
    const userId = message.author.id;
    const now = Date.now();
    const last = lastRequestAt.get(userId) || 0;
    if (now - last < cooldownMs) {
      await message.reply("A türelem a bölcsesség kapuja. Várj még egy pillanatot. — Zen tanítás");
      return;
    }
    lastRequestAt.set(userId, now);

    // Build a short prompt instructing the model to produce a one-line spiritual advice in Hungarian
    const prompt = `A felhasználó üzenetére válaszolj egyetlen tömör, költői sorral. A válasz legyen spirituális jellegű, bölcs és kedves hangvételű tanács magyar nyelven. A választ formázd így: "A bölcsesség... — Szerző". Ne tegyél fel kérdéseket. Üzenet: "${message.content.replace(/\"/g, '\\"')}"`;

    const resp = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Te egy nyugodt, bölcs spirituális vezető vagy. Írj rövid, költői hangvételű üzeneteket magyar nyelven, az indiai guru hagyományok és klasszikus spirituális történetmesélők stílusában. Minden válasz végén adj meg egy szerzőt (pl. 'Ősi bölcsesség', 'Zen mondás', 'Indiai közmondás', stb). Pontosan egy tömör sort adj válaszul a következő formátumban: 'A bölcsesség... — Szerző'"
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 80,
      temperature: 0.75,
    });

    const aiReply = resp.choices?.[0]?.message?.content?.trim();
    if (!aiReply) {
      await message.reply("A csend olykor a legbölcsebb válasz. — Zen mondás");
      return;
    }

    await message.reply(aiReply);
  } catch (err) {
    console.error("Error generating AI reply:", err);
    try {
      // When OpenAI is unavailable, use a random fallback quote
      if (err?.error?.type === 'insufficient_quota' || err?.status === 429) {
        const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        await message.reply(`${fallbackQuote} 🌟`);
      } else {
        // For other errors, still try a fallback quote
        const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        await message.reply(`${fallbackQuote} ✨`);
      }
    } catch (_) {}
  }
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
app.get("/", (req, res) => res.send("Bot is running ✅"));
app.listen(3000, () => console.log("🌐 Web server ready"));
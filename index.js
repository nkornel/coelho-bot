import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const quotes = [
  "Amikor valamit igazán akarsz, az egész univerzum összefog, hogy segítsen elérni. — Paulo Coelho",
  "Egyszer majd felébredsz, és nem lesz több időd megtenni, amit mindig is szerettél volna. Tedd meg most. — Paulo Coelho",
  "Légy realista: tervezz egy csodát. — Osho",
  "Az élet ott kezdődik, ahol a félelem véget ér. — Osho",
  "Ha ellenállsz a változásnak, magának az életnek állsz ellen. — Sadhguru",
  "Az vagy, aminek hiszed magad. — Paulo Coelho",
  "A béke belülről fakad. Ne kívül keresd. — Buddha",
  "Amit gondolsz, azzá válsz. Amit érzel, azt vonzod. Amit elképzelsz, azt megteremted. — Buddha",
  "Az egyetlen utazás az, ami befelé vezet. — Rainer Maria Rilke",
  "Ne hagyd, hogy mások véleményének zaja elnyomja a belső hangodat. — Steve Jobs",
  "A seb az a hely, ahol a Fény belép hozzád. — Rumi",
  "Határtalanná válsz, amikor rájössz, hogy sosem voltál korlátok közé zárva. — Ismeretlen",
  "Ne várj a tökéletes pillanatra. Ragadd meg a pillanatot, és tedd tökéletessé. — Ismeretlen",
  "Minél csendesebb leszel, annál többet hallasz. — Ram Dass",
  "Minden, amit el tudsz képzelni, valóságos. — Pablo Picasso",
  "A valóságodat az észlelésed teremti. — Ismeretlen",
  "Amit keresel, az is téged keres. — Rumi",
  "Az egyetlen kiút befelé vezet. — Jun Po Denis Kelly",
  "Nem kell uralkodnod a gondolataidon; csak ne hagyd, hogy ők uralkodjanak rajtad. — Dan Millman",
  "Engedd el, vagy magával rángat. — Zen közmondás",
  "Egy élet legnagyobb kiváltsága az, hogy azzá válhatsz, aki valójában vagy. — Carl Jung",
  "A nehézségek közepén lehetőség rejlik. — Albert Einstein",
  "Önmagadat szeretni egy életre szóló románc kezdete. — Oscar Wilde",
  "Változtasd meg, ahogyan a dolgokat nézed, és a dolgok, amiket nézel, megváltoznak. — Wayne Dyer",
  "Sár nélkül nincs lótusz. — Thich Nhat Hanh",
  "Add át magad annak, ami van. Engedd el, ami volt. Higgy abban, ami lesz. — Sonia Ricotti",
  "Nem fedezhetsz fel új óceánokat, ha nincs bátorságod elveszíteni a part látványát. — André Gide",
  "A jelen pillanat az egyetlen idő, ami létezik. — Eckhart Tolle",
  "Bármit is gondolsz, hogy a világ visszatart tőled, valójában te tartod vissza a világtól. — Eckhart Tolle",
  "Engedd el az eredményhez való ragaszkodást, és az út világossá válik. — Ismeretlen",
  "Az életed olyan jó, amilyen a gondolkodásmódod. — Ismeretlen",
  "A csillagok sem ragyognak sötétség nélkül. — D.H. Sidebottom",
  "Az univerzum nem azt adja, amit gondolataiddal kérsz, hanem azt, amit tetteiddel követelsz. — Steve Maraboli",
  "Nem te vagy egy csepp az óceánban. Te vagy az egész óceán egy cseppben. — Rumi",
  "Az elme minden. Amit gondolsz, azzá válsz. — Buddha",
  "Ne félj újrakezdeni. Ez egy lehetőség valami jobbat építeni. — Ismeretlen",
  "A csend Isten nyelve. Minden más csak gyenge fordítás. — Rumi",
  "Minél többet engedsz el, annál magasabbra emelkedsz. — Ismeretlen",
  "A hála azt, amid van, elegendővé teszi. — Aiszóposz",
  "Az energiád bemutat, mielőtt megszólalnál. — Ismeretlen",
  "A lélek mindig tudja, hogyan gyógyítsa meg önmagát. A kihívás az, hogy elcsendesítsd az elmét. — Caroline Myss",
  "Néha nyersz, néha tanulsz. — John C. Maxwell",
  "Minden reggel újra megszületünk. Az számít leginkább, amit ma teszünk. — Buddha",
  "A boldogság kulcsa, hogy hagyjuk a dolgokat olyannak lenni, amilyenek. — Mandy Hale",
  "A félelem hazug. — Ismeretlen"
];

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

client.on("messageCreate", (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Only respond in the designated channel
  if (message.channel.id !== process.env.QUOTE_CHANNEL_ID) return;

  // Reply with a random quote
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  message.reply(quote);
});

client.login(process.env.DISCORD_TOKEN);
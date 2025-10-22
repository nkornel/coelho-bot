# 🧘 Discord Quote Bot

A simple and elegant Discord bot that replies with inspirational quotes from Paulo Coelho or Indian gurus when a user types in a specific channel.

Built with:
- [Node.js](https://nodejs.org/)
- [discord.js v14](https://discord.js.org/)
- [Express](https://expressjs.com/)
- Docker (production ready)
- Optional private Docker registry support

---

## ✨ Features

- Restricts use to a specific Discord channel
- Lightweight Express server for uptime monitoring
- Easily deployable on any VPS with Docker

---

## 🧱 Project Structure

```
discord-quote-bot/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── index.js
├── .env.example
└── README.md
```

---

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/discord-quote-bot.git
cd discord-quote-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your `.env` file
```bash
cp .env.example .env
```

Then edit `.env` with your values:
```env
DISCORD_TOKEN=your_discord_token_here
QUOTE_CHANNEL_ID=123456789012345678
```

### 4. Run locally
```bash
npm start
```

---

## 🐳 Docker Usage

### Build the Docker image
```bash
docker build -t quote-bot:latest .
```

### Run the container
```bash
docker run -d   --name quote-bot   --env-file .env   --restart always   -p 3000:3000   quote-bot:latest
```

The bot will automatically log in and stay running.  
Express server will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧭 Docker Compose (Recommended)

Create or use the provided `docker-compose.yml`:

```yaml
version: "3.9"

services:
  quote-bot:
    build: .
    env_file:
      - .env
    restart: always
    ports:
      - "3000:3000"
```

Then run:
```bash
docker compose up -d
```

---

## 🧰 Using a Private Docker Registry

If you have your own registry (e.g. `registry.example.com:5000`):

### Build and push the image
```bash
docker build -t registry.example.com:5000/quote-bot:latest .
docker push registry.example.com:5000/quote-bot:latest
```

### Pull and run it on your VPS
```bash
docker pull registry.example.com:5000/quote-bot:latest

docker run -d   --name quote-bot   --env-file .env   --restart always   registry.example.com:5000/quote-bot:latest
```

Or use Compose:
```yaml
services:
  quote-bot:
    image: registry.example.com:5000/quote-bot:latest
    env_file:
      - .env
    restart: always
```

Then start:
```bash
docker compose up -d
```

---

## 🔁 Updating Your Bot

1. Rebuild and push:
   ```bash
   docker build -t registry.example.com:5000/quote-bot:latest .
   docker push registry.example.com:5000/quote-bot:latest
   ```

2. On the VPS:
   ```bash
   docker pull registry.example.com:5000/quote-bot:latest
   docker compose up -d
   ```

That’s it — your bot updates instantly.

---

## 🧘 Example Command

In your Discord server, type anything

💬 The bot will respond with an inspiring quote in your configured channel.

---

## 🪶 License

MIT License © 2025 Kornel M. Novak  
Feel free to use and modify for your own Discord servers.

---

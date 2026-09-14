# arb-dashboard

Arbitrage monitoring dashboard with dynamic and fixed pair modes.

## Prerequisites

- Node.js 20+
- MongoDB Atlas account (cloud database)
- pm2 (for production)

## Setup

### Install Node.js via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
```

### Install dependencies

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `MONGODB_URI`        | MongoDB Atlas connection string         |
| `NEXTAUTH_SECRET`    | NextAuth secret key                     |
| `AUTH_GOOGLE_ID`     | Google OAuth client ID                  |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret              |
| `ALLOWED_EMAILS`     | Comma-separated allowed email addresses |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
```

### Install pm2

```bash
npm install pm2 -g
pm2 startup
pm2 save
```

Start with pm2:

```bash
# Dashboard (port 2000)
PORT=2000 pm2 start npm --name "arb-dashboard" -- run start

# WebSocket server (port 2001)
pm2 delete arb-ws
WS_PORT=2001 pm2 start npm --name "arb-ws" -- run start:ws
```

Useful pm2 commands:

```bash
pm2 status            # List all processes
pm2 logs              # View logs
pm2 restart all       # Restart all processes
pm2 stop all          # Stop all processes
pm2 delete all        # Remove all processes
```

### Nginx configuration

Install nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

Create site config:

```bash
sudo nano /etc/nginx/sites-available/arb-dashboard
```

Paste the following:

```nginx
server {
    listen 80;
    server_name arb.deveric.io.vn;

    location / {
        proxy_pass http://127.0.0.1:2000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://127.0.0.1:2001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

Enable the site and restart nginx:

```bash
sudo ln -s /etc/nginx/sites-available/arb-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

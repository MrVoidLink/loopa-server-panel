<div align="center">

# Loopa Server Panel

_A polished control panel for managing Xray Reality inbounds on Linux servers._

</div>

---

## ✨ Highlights
- Modern React + Vite dashboard with Tailwind styling and Framer Motion micro-interactions.
- Guided wizard for provisioning Reality inbounds, including key generation and summary export.
- Safe teardown that removes the inbound, cleans up generated files, and restarts Xray.
- Tree-view modal that visualises the exact Record/Inbounds stored on disk.
- Express API with dedicated routes for status checks, deployment automation, and Xray control.

---

## 🧱 Architecture Overview
- **Frontend**  
  React 19 • Vite 7 • Tailwind CSS 4 • React Router 7 • Lucide Icons • QRCode generator.
- **Backend**  
  Express 5 routes + service layer that manages config files, key pairs, records, and systemctl restarts.
- **Automation**  
  `install.sh` bootstraps the entire stack (dependencies, systemd service, env prep) on a fresh server.

```
loopa-server-panel/
├── src/                  # React application
│   ├── app/              # Layout, context, hooks
│   └── features/         # Feature modules (Login, Dashboard, Config, Create, ...)
├── server/               # Express API + Xray service helpers
├── public/               # Static assets
└── install.sh            # One-liner deployment script
```

---

## ✅ Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- Linux server with `sudo` access (required for installing packages, writing to `/usr/local/etc/xray`, and restarting services)
- System utilities available: `curl`, `jq`, `openssl`, `qrencode` (the installer will add any missing dependencies)

---

## 🚀 Local Development
```bash
# Install dependencies
npm install

# Start the Vite dev server (frontend, port 5173)
npm run dev

# Launch the Express API (backend, port 4000)
node server/index.js
```

### Handy scripts
- `npm run build` – Production build into `dist/`
- `npm run preview` – Serve the production bundle locally
- `npm run lint` – Lint the entire project with ESLint

---

## ☁️ One-Line Server Install
```bash
curl -fsSL https://raw.githubusercontent.com/MrVoidLink/loopa-server-panel/main/install.sh | bash
```
The script downloads `install.sh`, installs required packages, configures systemd, and launches the panel.  
> ⚠️ Always review deployment scripts to ensure they comply with your security policies.

---

## 🧭 Core API Endpoints
| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/status` | Basic health and environment diagnostics |
| `POST` | `/api/deploy` | Trigger deployment/upgrade via bundled scripts |
| `POST` | `/api/xrar/reality` | Create a Reality inbound (keys, records, config update, restart) |
| `GET` | `/api/xrar/records` | List stored Reality records with metadata |
| `GET` | `/api/xrar/records/:id/structure` | Return a Record + Inbound tree payload |
| `DELETE` | `/api/xrar/records/:id` | Remove an inbound, clean up files, restart Xray |

---

## 🌳 Reality Tree Modal
- The Config page now includes a **Tree** button per record.
- On click, the UI requests `/records/:id/structure` and renders the returned JSON tree.
- The tree has two top-level sections:
  1. **Record** — Everything stored in `reality-records.json`
  2. **Inbound** — The actual object written into `config.json`
- Perfect for audits, troubleshooting, and sharing the precise server-side configuration.

---

## 🔮 Roadmap Ideas
- Authentication (JWT / OAuth) and role-based access.
- External persistence for metrics and logs (PostgreSQL, Redis, ...).
- Multi-server management from a single dashboard.
- Rich theming and internationalisation (i18n) support.

---

## 🤝 Contributing
Issues and pull requests are welcome! Please run the lint scripts before submitting and keep the commit history clean.

---

## 🛡️ License
Specify your license of choice here (MIT, Apache-2.0, etc.). By default all rights remain with the repository owner.

---

Crafted with ❤️ to make Xray Reality management effortless.

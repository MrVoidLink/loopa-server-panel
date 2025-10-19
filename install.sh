#!/bin/bash
set -e

echo "🌀 Installing Loopa Server Panel..."
echo "=================================="

# 1️⃣ Update packages
sudo apt update -y
sudo apt upgrade -y

# 2️⃣ Install dependencies
echo "📦 Installing dependencies..."
sudo apt install -y git curl

# 3️⃣ Install Node.js (v20 LTS)
if ! command -v node &> /dev/null
then
  echo "⚙️ Installing Node.js v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
else
  echo "✅ Node.js already installed: $(node -v)"
fi

# 🧩 Ensure version >= 20 (upgrade if needed)
NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "⬆️ Upgrading Node.js to v20..."
  sudo npm install -g n
  sudo n 20
fi

# 4️⃣ Clone or update repository
INSTALL_DIR="/opt/loopa-panel"
if [ -d "$INSTALL_DIR" ]; then
  echo "🔁 Updating existing installation..."
  cd $INSTALL_DIR && sudo git pull
else
  echo "⬇️ Cloning Loopa Panel repository..."
  sudo git clone https://github.com/MrVoidLink/loopa-server-panel.git $INSTALL_DIR
fi

cd $INSTALL_DIR

# 5️⃣ Install npm dependencies
echo "📦 Installing Node modules..."
sudo npm install
sudo npm install cors   # ✅ ensure CORS is available for API

# 6️⃣ Build frontend
echo "🏗 Building project..."
sudo npm run build

# 7️⃣ Install Serve globally if needed
if ! command -v serve &> /dev/null
then
  echo "📡 Installing serve..."
  sudo npm install -g serve
fi

# 8️⃣ Install PM2 if needed
if ! command -v pm2 &> /dev/null
then
  echo "🚀 Installing PM2..."
  sudo npm install -g pm2
fi

# 9️⃣ Start both frontend and backend
echo "🚀 Starting Loopa Server Panel & API..."
sudo pm2 start "npx serve -s dist -l 3000" --name "loopa-panel"
sudo pm2 start "node server/index.js" --name "loopa-api"
sudo pm2 save
sudo pm2 startup | tail -n 3

echo "✅ Installation complete!"
echo "🌍 Panel:   http://$(hostname -I | awk '{print $1}'):3000"
echo "🔌 API:     http://$(hostname -I | awk '{print $1}'):4000/api/status"

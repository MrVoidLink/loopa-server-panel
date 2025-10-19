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

# 3️⃣ Install Node.js (v18 LTS)
if ! command -v node &> /dev/null
then
  echo "⚙️ Installing Node.js LTS..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
else
  echo "✅ Node.js already installed: $(node -v)"
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

# 6️⃣ Build project
echo "🏗 Building project..."
sudo npm run build

# 7️⃣ Install Serve globally if needed
if ! command -v serve &> /dev/null
then
  echo "📡 Installing serve..."
  sudo npm install -g serve
fi

# 8️⃣ Start app with PM2
if ! command -v pm2 &> /dev/null
then
  echo "🚀 Installing PM2..."
  sudo npm install -g pm2
fi

echo "🚀 Starting Loopa Server Panel..."
sudo pm2 start "serve -s dist -l 3000" --name loopa-panel
sudo pm2 save
sudo pm2 startup | tail -n 3

echo "✅ Installation complete!"
echo "🌍 Access your panel at: http://$(hostname -I | awk '{print $1}'):3000"

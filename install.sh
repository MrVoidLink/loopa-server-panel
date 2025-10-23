#!/bin/bash
set -e

echo "🌀 Installing Loopa Server Panel..."
echo "=================================="

# 0️⃣ Ensure minimal tools before anything else
echo "🔍 Checking essential tools (curl + git)..."
if ! command -v curl >/dev/null 2>&1; then
  echo "➡️ Installing curl..."
  apt update -y && apt install -y curl
fi
if ! command -v git >/dev/null 2>&1; then
  echo "➡️ Installing git..."
  apt install -y git
fi

# 1️⃣ Update system packages
sudo apt update -y && sudo apt upgrade -y

# 2️⃣ Check Node.js (v20+)
if ! command -v node >/dev/null 2>&1; then
  echo "⚙️ Installing Node.js v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
else
  NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
  if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "⬆️ Upgrading Node.js to v20..."
    sudo npm install -g n
    sudo n 20
  else
    echo "✅ Node.js version OK: $(node -v)"
  fi
fi

# 3️⃣ Ensure npm installed
if ! command -v npm >/dev/null 2>&1; then
  echo "📦 Installing npm..."
  sudo apt install -y npm
fi

# 4️⃣ Clone or update repo
INSTALL_DIR="/opt/loopa-panel"
if [ -d "$INSTALL_DIR" ]; then
  echo "🔁 Updating existing installation..."
  cd $INSTALL_DIR && sudo git pull
else
  echo "⬇️ Cloning Loopa Panel repository..."
  sudo git clone https://github.com/MrVoidLink/loopa-server-panel.git $INSTALL_DIR
fi
cd $INSTALL_DIR

# 5️⃣ Install Node modules
echo "📦 Installing Node modules..."
sudo npm install --legacy-peer-deps

# 6️⃣ Build frontend
echo "🏗 Building project..."
sudo npm run build

# 7️⃣ Ensure serve & pm2 globally installed
for global_pkg in serve pm2; do
  if ! command -v $global_pkg >/dev/null 2>&1; then
    echo "🚀 Installing global package: $global_pkg..."
    sudo npm install -g $global_pkg
  else
    echo "✅ $global_pkg already installed."
  fi
done

# 8️⃣ Start processes
sudo pm2 delete loopa-panel || true
sudo pm2 delete loopa-api || true
sudo pm2 start "npx serve -s dist -l 3000" --name "loopa-panel"
sudo pm2 start "node server/index.js" --name "loopa-api"
sudo pm2 save
sudo pm2 startup | tail -n 3

echo "✅ Installation complete!"
echo "🌍 Panel: http://$(hostname -I | awk '{print $1}'):3000"
echo "🔌 API:   http://$(hostname -I | awk '{print $1}'):4000/api/status"

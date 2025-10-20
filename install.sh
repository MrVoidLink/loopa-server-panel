#!/bin/bash
set -e

echo "🌀 Installing Loopa Server Panel..."
echo "=================================="

# 1️⃣ Update system packages
sudo apt update -y && sudo apt upgrade -y

# 2️⃣ Check & install required base tools
echo "📦 Checking system dependencies..."

for pkg in git curl; do
  if ! dpkg -s $pkg >/dev/null 2>&1; then
    echo "➡️ Installing $pkg..."
    sudo apt install -y $pkg
  else
    echo "✅ $pkg already installed."
  fi
done

# 3️⃣ Check Node.js installation (v20+)
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

# 4️⃣ Ensure npm is installed
if ! command -v npm >/dev/null 2>&1; then
  echo "📦 Installing npm..."
  sudo apt install -y npm
else
  echo "✅ npm available: $(npm -v)"
fi

# 5️⃣ Clone or update repository
INSTALL_DIR="/opt/loopa-panel"
if [ -d "$INSTALL_DIR" ]; then
  echo "🔁 Updating existing installation..."
  cd $INSTALL_DIR && sudo git pull
else
  echo "⬇️ Cloning Loopa Panel repository..."
  sudo git clone https://github.com/MrVoidLink/loopa-server-panel.git $INSTALL_DIR
fi

cd $INSTALL_DIR

# 6️⃣ Install project dependencies
echo "📦 Installing Node modules..."
sudo npm install --legacy-peer-deps
sudo npm install cors --save

# 7️⃣ Build frontend
echo "🏗 Building project..."
sudo npm run build

# 8️⃣ Ensure serve & pm2 globally installed
for global_pkg in serve pm2; do
  if ! command -v $global_pkg >/dev/null 2>&1; then
    echo "🚀 Installing global package: $global_pkg..."
    sudo npm install -g $global_pkg
  else
    echo "✅ $global_pkg already installed."
  fi
done

# 9️⃣ Restart services
sudo pm2 delete all || true
sudo pm2 start "npx serve -s dist -l 3000" --name "loopa-panel"
sudo pm2 start "node server/index.js" --name "loopa-api"
sudo pm2 save
sudo pm2 startup | tail -n 3

echo "✅ Installation complete!"
echo "🌍 Panel: http://$(hostname -I | awk '{print $1}'):3000"
echo "🔌 API:   http://$(hostname -I | awk '{print $1}'):4000/api/status"

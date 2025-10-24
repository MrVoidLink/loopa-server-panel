#!/bin/bash
set -e

echo "Installing Loopa Server Panel..."
echo "================================"

# Step 0 - Ensure minimal tools
echo "Checking essential tools (curl, git, openssl)..."
if ! command -v curl >/dev/null 2>&1; then
  echo "Installing curl..."
  apt update -y && apt install -y curl
fi
if ! command -v git >/dev/null 2>&1; then
  echo "Installing git..."
  apt install -y git
fi
if ! command -v openssl >/dev/null 2>&1; then
  echo "Installing openssl..."
  apt install -y openssl
fi

# Step 1 - Update system packages
sudo apt update -y && sudo apt upgrade -y

# Step 2 - Check Node.js (v20+)
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
else
  NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
  if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "Upgrading Node.js to v20..."
    sudo npm install -g n
    sudo n 20
  else
    echo "Node.js version OK: $(node -v)"
  fi
fi

# Step 3 - Ensure npm installed
if ! command -v npm >/dev/null 2>&1; then
  echo "Installing npm..."
  sudo apt install -y npm
fi

# Step 4 - Clone or update repo
INSTALL_DIR="/opt/loopa-panel"
if [ -d "$INSTALL_DIR" ]; then
  echo "Updating existing installation..."
  cd "$INSTALL_DIR" && sudo git pull
else
  echo "Cloning Loopa Panel repository..."
  sudo git clone https://github.com/MrVoidLink/loopa-server-panel.git "$INSTALL_DIR"
fi
cd "$INSTALL_DIR"

# Step 5 - Install Node modules
echo "Installing Node modules..."
sudo npm install --legacy-peer-deps

# Step 6 - Build frontend
echo "Building project..."
sudo npm run build

# Step 7 - Generate credentials for the admin user
random_string() {
  openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c "$1"
}

LOOPA_DATA_DIR="/usr/local/etc/loopa-panel"
sudo mkdir -p "$LOOPA_DATA_DIR"

: "${ADMIN_USER:=admin}"
: "${ADMIN_PASS:=$(random_string 18)}"
: "${AUTH_SECRET:=$(random_string 32)}"

CREDS_FILE="$HOME/loopa-panel-credentials.txt"
cat > "$CREDS_FILE" <<EOF
Loopa Server Panel credentials
==============================
Generated at: $(date -Is)

Username: ${ADMIN_USER}
Password: ${ADMIN_PASS}

The API secret (AUTH_SECRET) is stored with the PM2 process.
Keep this file safe and delete it after saving the credentials securely.
EOF
chmod 600 "$CREDS_FILE"

echo "Admin username: ${ADMIN_USER}"
echo "Admin password: ${ADMIN_PASS}"
echo "Credentials saved to ${CREDS_FILE}"

# Step 8 - Ensure serve & pm2 globally installed
for global_pkg in serve pm2; do
  if ! command -v "$global_pkg" >/dev/null 2>&1; then
    echo "Installing global package: $global_pkg..."
    sudo npm install -g "$global_pkg"
  else
    echo "$global_pkg already installed."
  fi
done

# Step 9 - Start processes
sudo pm2 delete loopa-panel || true
sudo pm2 delete loopa-api || true
sudo pm2 start "npx serve -s dist -l 3000" --name "loopa-panel"
sudo env \
  ADMIN_USER="$ADMIN_USER" \
  ADMIN_PASS="$ADMIN_PASS" \
  AUTH_SECRET="$AUTH_SECRET" \
  LOOPA_DATA_DIR="$LOOPA_DATA_DIR" \
  pm2 start "node server/index.js" --name "loopa-api"
sudo pm2 save
sudo pm2 startup | tail -n 3

echo "Installation complete!"
echo "Panel: http://$(hostname -I | awk '{print $1}'):3000"
echo "API:   http://$(hostname -I | awk '{print $1}'):4000/api/status"

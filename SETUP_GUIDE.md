# 🚀 Local Server Setup Guide

## Quick Start (3 Steps)

### Step 1: Install Dependencies (if not already done)
```bash
cd bc
npm install
```

### Step 2: Start Local Blockchain
Open **Terminal 1** and run:
```bash
npm run node
```
**Keep this terminal running!** You'll see accounts with test ETH.

### Step 3: Deploy Contract & Start Server
Open **Terminal 2** and run:
```bash
# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Start the server
npm start
```

### Step 4: Access the Application
Open your browser and go to: **http://localhost:3000**

---

## Detailed Instructions

### Prerequisites Check
- ✅ Node.js v18+ installed
- ✅ npm installed
- ✅ MetaMask browser extension (for wallet connection)

### Step-by-Step Setup

#### 1. Navigate to Project Directory
```bash
cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start Hardhat Local Blockchain
In **Terminal 1**:
```bash
npm run node
```

You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

**⚠️ Keep this terminal open!**

#### 4. Deploy Smart Contract
In **Terminal 2** (new terminal):
```bash
# Navigate to project directory
cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"

# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local
```

You should see:
```
Deploying IPRegistry contract...
IPRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Network: localhost
Frontend config updated...
```

#### 5. Start Backend Server
Still in **Terminal 2**:
```bash
npm start
```

You should see:
```
╔══════════════════════════════════════════════════════════════╗
║   🔐 IP Registry Server Running                              ║
║   Local:    http://localhost:3000                            ║
║   API:      http://localhost:3000/api                        ║
╚══════════════════════════════════════════════════════════════╝
```

#### 6. Configure MetaMask (for wallet connection)

1. Open MetaMask extension
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter these details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
4. Click "Save"
5. Import a test account:
   - Click account icon → "Import Account"
   - Paste one of the private keys from Terminal 1 (Account #0)
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

#### 7. Access the Application
Open browser: **http://localhost:3000**

---

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3001
```

### Contract Not Deployed
- Make sure Hardhat node is running (Terminal 1)
- Run `npm run deploy:local` again

### MetaMask Connection Issues
- Make sure you're on "Hardhat Local" network
- Try resetting account: Settings → Advanced → Reset Account

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Running All Services at Once

You need **2 terminals**:
- **Terminal 1**: `npm run node` (blockchain)
- **Terminal 2**: `npm run compile && npm run deploy:local && npm start` (server)

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run node` | Start local Hardhat blockchain |
| `npm run compile` | Compile smart contracts |
| `npm run deploy:local` | Deploy to local network |
| `npm start` | Start backend server |
| `npm test` | Run tests |

---

## What's Running?

- **Hardhat Node**: Local blockchain at http://127.0.0.1:8545
- **Backend Server**: Express API at http://localhost:3000
- **Frontend**: Served at http://localhost:3000

---

## Next Steps

1. ✅ Blockchain running
2. ✅ Contract deployed
3. ✅ Server running
4. ✅ MetaMask configured
5. 🎉 Open http://localhost:3000 and start using the app!

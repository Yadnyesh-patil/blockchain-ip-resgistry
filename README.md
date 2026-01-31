# 🛡️ IP Shield - Blockchain Intellectual Property Protection

A decentralized application for creating tamper-proof ownership records of intellectual property using blockchain technology.

![IP Shield](https://img.shields.io/badge/Blockchain-Ethereum%20%7C%20Polygon-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-18%2B-brightgreen)

## 🌟 Features

- **📄 File Hashing**: Generate unique SHA-256 fingerprints for any file
- **⛓️ Blockchain Storage**: Immutable records on Ethereum/Polygon
- **⏰ Timestamped Proof**: Cryptographic proof of when you created something
- **🔍 Instant Verification**: Anyone can verify ownership in seconds
- **🚫 Duplicate Detection**: Prevents re-registration of same content
- **📜 Ownership Certificates**: Generate proof-of-ownership certificates

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│   Blockchain    │
│  (HTML/JS/CSS)  │     │  (Node.js API)  │     │ (Smart Contract)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │  File Upload          │  SHA-256 Hash         │  Store Record
        │  MetaMask Connect     │  Verify Hash          │  Verify Owner
        │  Show Results         │  Query Records        │  Get Timestamp
```

## 📋 Prerequisites

- **Node.js** v18 or higher
- **MetaMask** browser extension (for wallet connection)
- **Git** (to clone the repository)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd  C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc>

# Install dependencies
npm install
```

### 2. Start Local Blockchain

Open a terminal and run:

```bash
# Start Hardhat local blockchain
npm run node
```

Keep this terminal running! You'll see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39F... (10000 ETH)
Private Key: 0xac0974...
...
```

### 3. Deploy Smart Contract

Open a **new terminal** and run:

```bash
# Compile the contract
npm run compile

# Deploy to local network
npm run deploy:local
```

You'll see:
```
Deploying IPRegistry contract...
IPRegistry deployed to: 0x5FbDB2315678...
Network: localhost
```

### 4. Start the Application

```bash
# Start the backend server
npm start
```

You'll see:
```
╔══════════════════════════════════════════════════════════════╗
║   🔐 IP Registry Server Running                              ║
║   Local:    http://localhost:3000                            ║
╚══════════════════════════════════════════════════════════════╝
```

### 5. Open in Browser

Visit **http://localhost:3000** in your browser

### 6. Configure MetaMask

1. Open MetaMask
2. Add a new network with these settings:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
3. Import a test account using one of the private keys from Step 2

## 📖 How to Use

### Register Your IP

1. **Upload File**: Drag and drop or click to upload any file
2. **View Hash**: See the unique SHA-256 fingerprint
3. **Add Details**: Enter a title and description
4. **Connect Wallet**: Click "Connect MetaMask"
5. **Register**: Confirm the transaction in MetaMask
6. **Done!**: Your IP is now recorded on the blockchain

### Verify Ownership

1. Go to the **Verify** section
2. Upload the file OR paste the hash
3. View the ownership details and timestamp

## 📁 Project Structure

```
bc/
├── contracts/
│   └── IPRegistry.sol       # Solidity smart contract
├── backend/
│   ├── server.js            # Express server
│   ├── routes/
│   │   └── ipRoutes.js      # API endpoints
│   └── services/
│       ├── hashService.js   # SHA-256 hashing
│       └── blockchainService.js  # Web3 interaction
├── frontend/
│   ├── index.html           # Main page
│   ├── css/
│   │   └── styles.css       # Premium styling
│   └── js/
│       ├── app.js           # Main app logic
│       ├── web3.js          # Wallet connection
│       └── hash.js          # Client-side hashing
├── test/
│   └── IPRegistry.test.js   # Smart contract tests
├── scripts/
│   └── deploy.js            # Deployment script
├── package.json
└── hardhat.config.js
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run node` | Start local Hardhat blockchain |
| `npm run compile` | Compile smart contracts |
| `npm run test` | Run smart contract tests |
| `npm run deploy:local` | Deploy to local network |
| `npm start` | Start the backend server |

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/hash` | POST | Upload file, get hash |
| `/api/verify/:hash` | GET | Verify ownership |
| `/api/check/:hash` | GET | Check if registered |
| `/api/records/:address` | GET | Get user's records |
| `/api/stats` | GET | Get total registrations |
| `/api/contract` | GET | Get contract info |

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npx hardhat coverage
```

## 🌐 Deploy to Testnet (Optional)

### Polygon Mumbai Testnet

1. Create a `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

2. Get test MATIC from [Mumbai Faucet](https://faucet.polygon.technology/)

3. Deploy:
```bash
npm run deploy:mumbai
```

## 🔐 Security Considerations

- Only the hash is stored on-chain, not the file content
- Smart contract is non-upgradeable once deployed
- Original file is required to prove ownership
- Private keys should never be shared or committed

## 📝 Smart Contract Details

The `IPRegistry` contract provides:

- `registerIP(hash, title, description)` - Register a new IP
- `verifyOwnership(hash)` - Get owner and timestamp
- `isRegistered(hash)` - Check if hash exists
- `getIPDetails(hash)` - Get full record details
- `getRecordsByOwner(address)` - Get all user records
- `totalRegistrations()` - Total IPs registered

## ❓ Troubleshooting

### MetaMask issues
- Make sure you're connected to the right network
- Try resetting account (Settings → Advanced → Reset Account)

### "Contract not deployed" error
- Make sure the local blockchain is running (`npm run node`)
- Run deployment again (`npm run deploy:local`)

### Transaction fails
- Check that you have ETH in your account
- Try increasing gas limit in MetaMask

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Ethereum, Solidity, and Node.js**

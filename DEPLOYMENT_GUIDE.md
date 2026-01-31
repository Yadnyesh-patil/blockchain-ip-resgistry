# 🚀 Deployment Guide

Complete guide for deploying your IP Registry application to different environments.

## 📋 Table of Contents

1. [Local Deployment](#1-local-deployment)
2. [Testnet Deployment (Mumbai/Polygon)](#2-testnet-deployment-mumbaipolygon)
3. [Testnet Deployment (Sepolia/Ethereum)](#3-testnet-deployment-sepoliaethereum)
4. [Production Deployment](#4-production-deployment)
5. [Frontend Deployment](#5-frontend-deployment)

---

## 1. Local Deployment

### Quick Start
```bash
# Terminal 1: Start blockchain
npm run node

# Terminal 2: Deploy and start
npm run compile
npm run deploy:local
npm start
```

Access at: **http://localhost:3000**

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

---

## 2. Testnet Deployment (Mumbai/Polygon)

### Prerequisites
- MetaMask wallet with test MATIC
- Private key from your wallet (for deployment)
- RPC URL for Mumbai testnet

### Step 1: Get Test Tokens
1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Mumbai" network
3. Enter your wallet address
4. Request test MATIC

### Step 2: Create Environment File
Create `.env` file in the `bc` directory:

```env
# Mumbai Testnet Configuration
PRIVATE_KEY=your_wallet_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Optional: Use other RPC providers
# MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
# MUMBAI_RPC_URL=https://rpc.ankr.com/polygon_mumbai
```

**⚠️ SECURITY WARNING**: Never commit `.env` file to git! Add it to `.gitignore`.

### Step 3: Deploy to Mumbai
```bash
# Compile contracts
npm run compile

# Deploy to Mumbai testnet
npm run deploy:mumbai
```

You'll see:
```
Deploying IPRegistry contract...
IPRegistry deployed to: 0x...
Network: mumbai
```

### Step 4: Update Backend Configuration
The deployment script automatically updates `frontend/js/config.js`. 

For backend, update `backend/routes/ipRoutes.js` or use environment variables:

```env
# Add to .env
NETWORK=mumbai
CONTRACT_ADDRESS=0x...  # From deployment output
RPC_URL=https://rpc-mumbai.maticvigil.com
```

### Step 5: Start Server
```bash
npm start
```

### Step 6: Configure MetaMask
1. Open MetaMask
2. Add Network:
   - **Network Name**: Mumbai Testnet
   - **RPC URL**: https://rpc-mumbai.maticvigil.com
   - **Chain ID**: 80001
   - **Currency Symbol**: MATIC
3. Switch to Mumbai network

---

## 3. Testnet Deployment (Sepolia/Ethereum)

### Prerequisites
- MetaMask wallet with test ETH
- Private key from your wallet
- RPC URL for Sepolia testnet

### Step 1: Get Test ETH
1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH

### Step 2: Update Environment File
Add to `.env`:

```env
# Sepolia Testnet Configuration
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Optional: Use Infura
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### Step 3: Add Deployment Script
Add to `package.json` scripts:
```json
"deploy:sepolia": "npx hardhat run scripts/deploy.js --network sepolia"
```

### Step 4: Deploy
```bash
npm run compile
npm run deploy:sepolia
```

### Step 5: Configure MetaMask
1. Add Sepolia network:
   - **Network Name**: Sepolia
   - **RPC URL**: https://rpc.sepolia.org
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH

---

## 4. Production Deployment

### Option A: Deploy to Polygon Mainnet

#### Prerequisites
- Real MATIC tokens (for gas fees)
- Production wallet with sufficient funds
- RPC URL for Polygon mainnet

#### Step 1: Environment Setup
```env
# Polygon Mainnet
PRIVATE_KEY=your_production_private_key
POLYGON_RPC_URL=https://polygon-rpc.com

# Or use Infura/Alchemy
# POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_KEY
```

#### Step 2: Update Hardhat Config
Add to `hardhat.config.js`:
```javascript
polygon: {
  url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 137
}
```

#### Step 3: Deploy
```bash
npm run compile
npx hardhat run scripts/deploy.js --network polygon
```

### Option B: Deploy to Ethereum Mainnet

⚠️ **WARNING**: Mainnet deployment costs real ETH. Test thoroughly first!

```env
# Ethereum Mainnet
PRIVATE_KEY=your_production_private_key
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
```

Add to `hardhat.config.js`:
```javascript
mainnet: {
  url: process.env.MAINNET_RPC_URL,
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 1
}
```

Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

---

## 5. Frontend Deployment

### Option A: Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd bc
vercel
```

3. **Configure Environment Variables** in Vercel dashboard:
   - `CONTRACT_ADDRESS`: Your deployed contract address
   - `NETWORK`: Network name (mumbai, sepolia, etc.)

### Option B: Deploy to Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
cd bc
netlify deploy --prod
```

### Option C: Deploy to GitHub Pages

1. **Update `package.json`**:
```json
"scripts": {
  "build": "npm run compile && npm run deploy:local",
  "deploy:gh": "gh-pages -d frontend"
}
```

2. **Deploy**:
```bash
npm run deploy:gh
```

### Option D: Traditional Hosting (cPanel, etc.)

1. **Build for production**:
```bash
npm run compile
npm run deploy:local  # or your network
```

2. **Upload files**:
   - Upload `frontend/` folder contents
   - Upload `backend/` folder
   - Upload `package.json` and run `npm install` on server

3. **Configure server**:
   - Set up Node.js environment
   - Configure environment variables
   - Set up PM2 or similar for process management

---

## 🔧 Backend Server Deployment

### Option A: Deploy to Heroku

1. **Install Heroku CLI**

2. **Create `Procfile`**:
```
web: node backend/server.js
```

3. **Deploy**:
```bash
heroku create your-app-name
heroku config:set PRIVATE_KEY=your_key
heroku config:set NETWORK=mumbai
heroku config:set CONTRACT_ADDRESS=0x...
git push heroku main
```

### Option B: Deploy to Railway

1. **Connect GitHub repository**
2. **Set environment variables**:
   - `PRIVATE_KEY`
   - `NETWORK`
   - `CONTRACT_ADDRESS`
   - `RPC_URL`
3. **Deploy automatically**

### Option C: Deploy to DigitalOcean/Render

1. **Create Node.js app**
2. **Set environment variables**
3. **Deploy via Git or upload files**

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PRIVATE_KEY` | Wallet private key for deployment | `0x...` |
| `MUMBAI_RPC_URL` | Mumbai testnet RPC endpoint | `https://rpc-mumbai.maticvigil.com` |
| `SEPOLIA_RPC_URL` | Sepolia testnet RPC endpoint | `https://rpc.sepolia.org` |
| `POLYGON_RPC_URL` | Polygon mainnet RPC endpoint | `https://polygon-rpc.com` |
| `MAINNET_RPC_URL` | Ethereum mainnet RPC endpoint | `https://mainnet.infura.io/v3/...` |
| `NETWORK` | Current network name | `mumbai`, `sepolia`, `polygon` |
| `CONTRACT_ADDRESS` | Deployed contract address | `0x...` |
| `PORT` | Server port | `3000` |

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Add to `.gitignore`
   - Use environment variables in hosting platforms

2. **Use separate wallets**
   - Testnet wallet for development
   - Production wallet for mainnet

3. **Protect private keys**
   - Use hardware wallets for production
   - Never share private keys
   - Use environment variables, not code

4. **Verify contracts**
   - Verify on block explorers (Polygonscan, Etherscan)
   - Share verified contract addresses

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Contracts compiled successfully
- [ ] Tests passing (`npm test`)
- [ ] Environment variables configured
- [ ] Sufficient tokens for gas fees
- [ ] Network configured in MetaMask

### After Deployment
- [ ] Contract address saved
- [ ] Frontend config updated
- [ ] Backend connected to correct network
- [ ] Test registration works
- [ ] Test verification works
- [ ] Contract verified on block explorer

---

## 🐛 Troubleshooting

### "Insufficient funds"
- Get test tokens from faucet
- Check wallet balance

### "Contract not deployed"
- Run deployment script again
- Check network configuration
- Verify RPC URL is correct

### "Transaction failed"
- Increase gas limit
- Check network congestion
- Verify contract address

### "Connection refused"
- Check RPC URL
- Verify network is running
- Check firewall settings

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygon Documentation](https://docs.polygon.technology/)
- [Ethereum Documentation](https://ethereum.org/en/developers/)
- [MetaMask Setup](https://metamask.io/)

---

**Need Help?** Check the main [README.md](./README.md) or [SETUP_GUIDE.md](./SETUP_GUIDE.md)

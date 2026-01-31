# ⚡ Quick Deployment Guide

## 🏠 Local Deployment (Development)

```bash
# Terminal 1
npm run node

# Terminal 2
npm run compile
npm run deploy:local
npm start
```

Visit: **http://localhost:3000**

---

## 🌐 Testnet Deployment (Mumbai/Polygon)

### Step 1: Setup Environment
1. Copy `env.example` to `.env`
2. Add your private key and RPC URL:
```env
PRIVATE_KEY=your_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
NETWORK=mumbai
```

### Step 2: Get Test Tokens
- Visit: https://faucet.polygon.technology/
- Select "Mumbai" network
- Request test MATIC

### Step 3: Deploy
```bash
npm run compile
npm run deploy:mumbai
```

### Step 4: Update .env
Add the contract address from deployment output:
```env
CONTRACT_ADDRESS=0x...  # From deployment
```

### Step 5: Start Server
```bash
npm start
```

### Step 6: Configure MetaMask
- Network: Mumbai Testnet
- RPC: https://rpc-mumbai.maticvigil.com
- Chain ID: 80001
- Symbol: MATIC

---

## 🚀 Production Deployment (Polygon Mainnet)

### Step 1: Environment Setup
```env
PRIVATE_KEY=your_production_key
POLYGON_RPC_URL=https://polygon-rpc.com
NETWORK=polygon
```

### Step 2: Deploy
```bash
npm run compile
npm run deploy:polygon
```

### Step 3: Update .env
```env
CONTRACT_ADDRESS=0x...  # From deployment
```

### Step 4: Start Server
```bash
npm start
```

---

## 📋 Deployment Checklist

- [ ] Environment variables configured (`.env` file)
- [ ] Contracts compiled (`npm run compile`)
- [ ] Sufficient tokens for gas fees
- [ ] Contract deployed successfully
- [ ] Contract address saved in `.env`
- [ ] Server started (`npm start`)
- [ ] MetaMask configured for correct network
- [ ] Test registration works
- [ ] Test verification works

---

## 🔗 Quick Links

- **Full Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Mumbai Faucet**: https://faucet.polygon.technology/
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

## ⚠️ Important Notes

1. **Never commit `.env` file** - it contains private keys!
2. **Test on testnet first** before mainnet deployment
3. **Verify contract** on block explorer after deployment
4. **Keep private keys secure** - use hardware wallets for production

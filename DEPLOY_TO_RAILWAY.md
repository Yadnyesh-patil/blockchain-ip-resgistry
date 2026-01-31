# 🚀 Deploy to Railway (Easiest Free Option)

## Quick Deployment Guide

### Step 1: Prepare Contract for Testnet

1. **Deploy to Mumbai testnet:**
   ```bash
   # Create .env with your private key
   PRIVATE_KEY=your_key
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   
   # Deploy
   npm run compile
   npm run deploy:mumbai
   ```

2. **Save the contract address** from output

---

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/ip-shield.git
git push -u origin main
```

---

### Step 3: Deploy on Railway

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway auto-detects Node.js!**

---

### Step 4: Configure Environment Variables

In Railway dashboard:

1. Click on your service
2. Go to "Variables" tab
3. Add these:

```
NETWORK = mumbai
CONTRACT_ADDRESS = YOUR_CONTRACT_ADDRESS
MUMBAI_RPC_URL = https://rpc-mumbai.maticvigil.com
NODE_ENV = production
```

---

### Step 5: Get Your URL

1. Click "Settings"
2. Click "Generate Domain"
3. Your app is live! 🎉

---

## That's It!

Your app will be live at: `https://your-app.up.railway.app`

---

## For Users

Users need to:
1. Add Mumbai testnet to MetaMask
2. Get test MATIC from: https://faucet.polygon.technology/
3. Visit your URL and use the app!

# 🚀 Deploy to Render (Free Hosting)

## Step-by-Step Guide

### Prerequisites
- GitHub account (free)
- Git installed on your computer
- Contract deployed to Mumbai testnet (we'll do this)

---

## Step 1: Deploy Contract to Mumbai Testnet

First, we need to deploy the smart contract to a public testnet:

1. **Get test MATIC:**
   - Visit: https://faucet.polygon.technology/
   - Select "Mumbai" network
   - Enter your wallet address
   - Request test MATIC

2. **Create `.env` file:**
   ```env
   PRIVATE_KEY=your_wallet_private_key
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   NETWORK=mumbai
   ```

3. **Deploy contract:**
   ```bash
   npm run compile
   npm run deploy:mumbai
   ```

4. **Save the contract address** from the output

---

## Step 2: Push Code to GitHub

1. **Initialize Git** (if not already):
   ```bash
   cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository:**
   - Go to: https://github.com/new
   - Create a new repository (e.g., "ip-shield")
   - Don't initialize with README

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ip-shield.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy to Render

1. **Sign up for Render:**
   - Go to: https://render.com
   - Sign up with GitHub (free)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service:**
   - **Name:** ip-shield (or any name)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Set Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these:
   ```
   NODE_ENV = production
   PORT = 10000
   NETWORK = mumbai
   CONTRACT_ADDRESS = YOUR_CONTRACT_ADDRESS_FROM_STEP_1
   MUMBAI_RPC_URL = https://rpc-mumbai.maticvigil.com
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your app will be live at: `https://your-app-name.onrender.com`

---

## Step 4: Update Frontend for Testnet

After deployment, users need to:
1. Add Mumbai testnet to MetaMask
2. Get test MATIC from faucet
3. Use the deployed contract address

---

## Alternative: Deploy to Railway

### Railway Deployment (Simpler)

1. **Sign up:** https://railway.app (use GitHub)
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add Environment Variables:**
   - `NETWORK=mumbai`
   - `CONTRACT_ADDRESS=YOUR_ADDRESS`
   - `MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com`
5. **Deploy** - Railway auto-detects Node.js

---

## Quick Checklist

- [ ] Contract deployed to Mumbai testnet
- [ ] Contract address saved
- [ ] Code pushed to GitHub
- [ ] Render/Railway account created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] App accessible via URL

---

## After Deployment

Your app will be live at a URL like:
- Render: `https://ip-shield.onrender.com`
- Railway: `https://your-app.up.railway.app`

Users can:
1. Visit your URL
2. Connect MetaMask (Mumbai testnet)
3. Register and verify IPs!

---

## Need Help?

If you get stuck:
1. Check deployment logs in Render/Railway dashboard
2. Verify environment variables are set
3. Make sure contract is deployed to Mumbai
4. Check that Mumbai RPC URL is correct

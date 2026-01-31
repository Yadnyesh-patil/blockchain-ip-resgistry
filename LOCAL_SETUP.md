# 🚀 Quick Local Setup Guide

## Step-by-Step Instructions

### Terminal 1: Start Local Blockchain

1. Open PowerShell or Command Prompt
2. Navigate to project:
   ```powershell
   cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"
   ```
3. Start the blockchain:
   ```powershell
   npm run node
   ```
4. **Keep this terminal open!** You'll see:
   ```
   Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
   
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

### Terminal 2: Deploy Contract & Start Server

1. Open a **NEW** PowerShell or Command Prompt
2. Navigate to project:
   ```powershell
   cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"
   ```
3. Compile contracts:
   ```powershell
   npm run compile
   ```
4. Deploy to local network:
   ```powershell
   npm run deploy:local
   ```
5. Start the server:
   ```powershell
   npm start
   ```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

### Step 4: Configure MetaMask (Optional for Testing)

1. Open MetaMask extension
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
4. Import test account:
   - Click account icon → "Import Account"
   - Paste private key from Terminal 1 (Account #0)

---

## 🎯 Quick Commands Summary

**Terminal 1:**
```powershell
npm run node
```

**Terminal 2:**
```powershell
npm run compile
npm run deploy:local
npm start
```

---

## ✅ What You Should See

**Terminal 1 (Blockchain):**
- Running blockchain server
- List of accounts with ETH

**Terminal 2 (Server):**
- Contract deployment success
- Server running message with URL

**Browser:**
- IP Shield homepage
- Upload and verify sections

---

## 🐛 Troubleshooting

**"Port already in use"**
- Close other applications using port 3000 or 8545
- Or change port in `.env` file

**"Contract not deployed"**
- Make sure Terminal 1 is running (`npm run node`)
- Run `npm run deploy:local` again

**"Cannot connect to blockchain"**
- Check Terminal 1 is still running
- Verify it says "Started HTTP... at http://127.0.0.1:8545/"

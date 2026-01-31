# 🔐 How to Install MetaMask

## Quick Installation Guide

### Step 1: Install MetaMask Extension

**For Chrome/Edge/Brave:**
1. Go to: https://metamask.io/download/
2. Click "Install MetaMask for Chrome" (or your browser)
3. Click "Add to Chrome" / "Add to Edge"
4. Click "Add Extension"

**For Firefox:**
1. Go to: https://metamask.io/download/
2. Click "Install MetaMask for Firefox"
3. Click "Add to Firefox"
4. Click "Add"

**For Opera:**
1. Go to: https://metamask.io/download/
2. Click "Install MetaMask for Opera"
3. Follow installation prompts

---

### Step 2: Create or Import Wallet

After installation:

1. **Click the MetaMask icon** in your browser toolbar
2. Choose one:
   - **"Create a new wallet"** - For testing (create a new account)
   - **"Import an existing wallet"** - If you have a seed phrase

3. If creating new:
   - Set a password
   - **Save your Secret Recovery Phrase** (write it down!)
   - Confirm the phrase

---

### Step 3: Configure for Local Network

1. **Open MetaMask** (click the extension icon)
2. Click the network dropdown (top left, usually says "Ethereum Mainnet")
3. Click **"Add Network"** → **"Add a network manually"**
4. Enter these details:

   ```
   Network Name: Hardhat Local
   RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency Symbol: ETH
   Block Explorer URL: (leave empty)
   ```

5. Click **"Save"**

---

### Step 4: Import Test Account (For Local Testing)

1. In MetaMask, click your account icon (top right)
2. Click **"Import Account"**
3. Get a private key from your blockchain terminal (the one running `npm run node`)
4. Look for output like:
   ```
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
5. Copy the **Private Key** (the long hex string starting with `0x`)
6. Paste it into MetaMask
7. Click **"Import"**

You should now see the account with 10000 ETH for testing!

---

### Step 5: Connect to Your App

1. Go back to: **http://localhost:3000**
2. Make sure MetaMask is on **"Hardhat Local"** network
3. Click **"Connect Wallet"** button
4. MetaMask will ask for permission - click **"Connect"**
5. Done! You can now register IPs on the blockchain

---

## ✅ What You Can Do Without MetaMask

Even without MetaMask, you can:
- ✅ Upload files and see their SHA-256 hash
- ✅ Verify if a file is registered (through API)
- ✅ View file hashes and details
- ❌ Cannot register IPs on blockchain (needs MetaMask)

---

## 🐛 Troubleshooting

**"MetaMask not detected"**
- Make sure the extension is installed and enabled
- Refresh the browser page
- Check if MetaMask is unlocked

**"Wrong network"**
- Make sure you're on "Hardhat Local" network
- Check the RPC URL is: `http://127.0.0.1:8545`
- Check Chain ID is: `31337`

**"No accounts found"**
- Import a test account using private key from blockchain terminal
- Make sure the blockchain is running (`npm run node`)

**"Transaction failed"**
- Make sure you have ETH in your account (should have 10000 ETH from test account)
- Check blockchain is running
- Try refreshing the page

---

## 📝 Quick Reference

- **MetaMask Download**: https://metamask.io/download/
- **Local Network RPC**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Network Name**: Hardhat Local

---

**Need Help?** Make sure:
1. ✅ MetaMask extension is installed
2. ✅ Local blockchain is running (`npm run node`)
3. ✅ You're on "Hardhat Local" network
4. ✅ Test account is imported with ETH

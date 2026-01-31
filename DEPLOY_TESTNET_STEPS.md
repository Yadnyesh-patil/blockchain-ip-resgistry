# 📝 Step-by-Step: Deploy to Mumbai Testnet

## Step 1: Get Test MATIC

1. **Open MetaMask**
2. **Switch to Mumbai Testnet:**
   - Click network dropdown
   - If Mumbai is not there, add it:
     - Network Name: Mumbai Testnet
     - RPC URL: https://rpc-mumbai.maticvigil.com
     - Chain ID: 80001
     - Currency Symbol: MATIC
3. **Copy your wallet address** (click on account name)
4. **Get test MATIC:**
   - Visit: https://faucet.polygon.technology/
   - Select "Mumbai" network
   - Paste your wallet address
   - Click "Submit"
   - Wait a few minutes for MATIC to arrive

---

## Step 2: Create .env File

1. **Copy the example file:**
   ```bash
   copy env.example .env
   ```

2. **Edit .env file** and add:
   ```env
   PRIVATE_KEY=your_wallet_private_key_here
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   NETWORK=mumbai
   ```

3. **Get your private key from MetaMask:**
   - Open MetaMask
   - Click account icon (top right)
   - Click "Account details"
   - Click "Show private key"
   - Enter password
   - Copy the private key
   - Paste it in .env file (without 0x prefix is fine)

⚠️ **SECURITY WARNING:** Never share your private key! Only use it for testnet.

---

## Step 3: Deploy Contract

Once you have:
- ✅ Test MATIC in your wallet
- ✅ .env file configured

Run:
```bash
npm run compile
npm run deploy:mumbai
```

---

## Step 4: Save Contract Address

After deployment, you'll see:
```
IPRegistry deployed to: 0x...
Network: mumbai
```

**Copy this address!** You'll need it for:
- Environment variables in hosting platform
- Frontend configuration

---

## Troubleshooting

**"Insufficient funds"**
- Get more test MATIC from faucet
- Wait a few minutes for transaction to process

**"Private key error"**
- Make sure .env file exists
- Check private key is correct (no extra spaces)
- Make sure it's the private key for the wallet with MATIC

**"RPC error"**
- Check MUMBAI_RPC_URL in .env
- Try alternative RPC: https://rpc.ankr.com/polygon_mumbai

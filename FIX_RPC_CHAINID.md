# 🔧 Fix "Could not fetch chain ID" Error

## Problem
RPC endpoint is not responding or incorrect

## Solutions

### Solution 1: Try Alternative RPC URLs

The Mumbai RPC might be down. Try these alternatives:

**Option A: Alchemy (Recommended)**
```
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
```
Get free API key: https://www.alchemy.com/

**Option B: Infura**
```
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
```
Get free API key: https://infura.io/

**Option C: Ankr (No API key needed)**
```
MUMBAI_RPC_URL=https://rpc.ankr.com/polygon_mumbai
```

**Option D: QuickNode**
```
MUMBAI_RPC_URL=https://polygon-mumbai.gateway.tenderly.co
```

**Option E: Public RPC (Backup)**
```
MUMBAI_RPC_URL=https://matic-mumbai.chainstacklabs.com
```

---

### Solution 2: Update .env File

1. Open `.env` file
2. Update `MUMBAI_RPC_URL` with one of the above
3. Save and try again

---

### Solution 3: Test RPC Connection

Test if RPC is working:
```bash
curl -X POST https://rpc-mumbai.maticvigil.com -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Should return: `{"jsonrpc":"2.0","id":1,"result":"0x13881"}` (80001 in hex)

---

### Solution 4: Use Sepolia Instead

If Mumbai keeps failing, use Sepolia testnet:

1. Update `.env`:
```env
NETWORK=sepolia
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

2. Get test ETH: https://sepoliafaucet.com/

3. Deploy:
```bash
npm run deploy:sepolia
```

---

## Quick Fix (No API Key Needed)

Use Ankr RPC (free, no signup):
```env
MUMBAI_RPC_URL=https://rpc.ankr.com/polygon_mumbai
```

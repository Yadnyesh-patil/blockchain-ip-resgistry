# 🔄 Update RPC URL in .env File

## Quick Fix

The default RPC might be down. Update your `.env` file:

1. **Open `.env` file** in the `bc` folder

2. **Change this line:**
   ```env
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   ```
   
   **To this (Ankr - more reliable, free, no API key):**
   ```env
   MUMBAI_RPC_URL=https://rpc.ankr.com/polygon_mumbai
   ```

3. **Save the file**

4. **Try deploying again:**
   ```bash
   npm run deploy:mumbai
   ```

---

## Alternative RPC URLs (if Ankr doesn't work)

**Option 1: QuickNode (Free)**
```env
MUMBAI_RPC_URL=https://polygon-mumbai.gateway.tenderly.co
```

**Option 2: Chainstack**
```env
MUMBAI_RPC_URL=https://matic-mumbai.chainstacklabs.com
```

**Option 3: PublicNode**
```env
MUMBAI_RPC_URL=https://polygon-mumbai-bor.publicnode.com
```

---

## Test RPC Connection

After updating, test if it works:
```bash
npm run compile
npm run deploy:mumbai
```

If it still fails, try a different RPC from the list above.

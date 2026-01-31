# 🔧 Fix RPC Endpoint Error

## Problem
Transaction failed with: "RPC endpoint returned too many errors"

## Causes
1. **Blockchain not running** - Hardhat node is stopped
2. **MetaMask RPC URL missing** - Network configuration incomplete

## Solution

### Step 1: Fix MetaMask Network Configuration

1. **In MetaMask**, make sure you're on the "Edit network" screen
2. **Fill in the "Default RPC URL" field** with:
   ```
   http://127.0.0.1:8545
   ```
3. **Click "Save"**

### Step 2: Start/Restart Blockchain

The blockchain needs to be running. Open a terminal and run:

```powershell
cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"
npm run node
```

**Keep this terminal open!** You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Step 3: Verify Connection

1. Make sure blockchain is running (Step 2)
2. Make sure MetaMask has correct RPC URL (Step 1)
3. Refresh your browser page
4. Try the transaction again

---

## Complete MetaMask Network Settings

Make sure your "Hardhat Local" network has:

```
Network name: Hardhat Local
Default RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency symbol: ETH
Block explorer URL: (leave empty)
```

---

## Quick Checklist

- [ ] Blockchain is running (`npm run node`)
- [ ] MetaMask RPC URL is set to `http://127.0.0.1:8545`
- [ ] MetaMask Chain ID is `31337`
- [ ] Server is running (`npm start`)
- [ ] Browser page is refreshed

---

## Still Not Working?

1. **Check blockchain terminal** - Make sure it's still running
2. **Check server terminal** - Make sure server is running
3. **Restart everything:**
   - Stop blockchain (Ctrl+C)
   - Stop server (Ctrl+C)
   - Start blockchain: `npm run node`
   - Start server: `npm start` (in new terminal)
4. **Refresh browser** and try again

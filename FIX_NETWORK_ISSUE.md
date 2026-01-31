# 🔧 Fix Network Detection Issue

## Problem
MetaMask shows "Hardhat Local" but app detects Chain ID 1 (Ethereum Mainnet)

## Solution

### Step 1: Remove and Re-add Hardhat Local Network

1. **Open MetaMask**
2. Click the **network dropdown** (top left)
3. Click **"Settings"** or **"Edit"** next to "Hardhat Local"
4. **Delete/Remove** the Hardhat Local network
5. Click **"Add Network"** → **"Add a network manually"**
6. Enter these **EXACT** values:

   ```
   Network Name: Hardhat Local
   RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency Symbol: ETH
   Block Explorer URL: (leave empty)
   ```

7. Click **"Save"**

### Step 2: Verify Network

1. Make sure **"Hardhat Local"** is selected
2. Check the network dropdown shows **"Hardhat Local"**
3. Your balance should show **ETH** (not $0.00)

### Step 3: Refresh and Connect

1. **Refresh** your browser page (F5)
2. Click **"Connect MetaMask"** again
3. It should work now!

---

## Alternative: Quick Fix

If the above doesn't work:

1. **Close MetaMask** (click X on the extension popup)
2. **Refresh** the browser page
3. **Reopen MetaMask**
4. Make sure "Hardhat Local" is selected
5. Try connecting again

---

## Still Not Working?

1. **Check Chain ID in MetaMask:**
   - Open MetaMask
   - Click network dropdown
   - Click "Hardhat Local" → "Details" or "Edit"
   - Verify Chain ID is exactly **31337** (not 1, not 1337)

2. **Check Browser Console:**
   - Press F12
   - Go to Console tab
   - Look for chainId values
   - Share any errors you see

3. **Try Different Browser:**
   - Chrome, Firefox, Edge all work
   - Sometimes one browser works better than others

---

## Expected Result

After fixing, when you click "Connect MetaMask":
- ✅ No network error
- ✅ Wallet connects successfully
- ✅ You can register IPs

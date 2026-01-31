# 🔧 Troubleshooting Wallet Connection

## Common Issues and Solutions

### Issue: "Failed to connect wallet. Please try again."

**Possible Causes:**

1. **MetaMask Popup Blocked**
   - Check if browser blocked the MetaMask popup
   - Look for a popup blocker icon in your browser address bar
   - Click "Allow" or "Always allow popups from this site"

2. **Connection Rejected**
   - You might have clicked "Reject" in MetaMask
   - Try clicking "Connect MetaMask" again
   - Make sure to click "Connect" or "Next" in MetaMask popup

3. **Wrong Network**
   - Make sure MetaMask shows "Hardhat Local" network
   - If not, switch to Hardhat Local network
   - Check Chain ID is 31337

4. **MetaMask Not Unlocked**
   - Make sure MetaMask is unlocked
   - Enter your password if prompted

5. **Browser Console Errors**
   - Press F12 to open Developer Tools
   - Check the Console tab for errors
   - Share any red error messages

---

## Step-by-Step Fix

### Step 1: Check Browser Console
1. Press **F12** (or Right-click → Inspect)
2. Go to **Console** tab
3. Look for any red error messages
4. Try connecting wallet again and watch for new errors

### Step 2: Check MetaMask
1. Click MetaMask extension icon
2. Make sure it's **unlocked**
3. Check network is **"Hardhat Local"**
4. Check you have an account selected

### Step 3: Try These Solutions

**Solution A: Refresh and Retry**
1. Refresh the page (F5)
2. Try connecting again

**Solution B: Clear Site Data**
1. Press F12 → Application tab
2. Click "Clear storage"
3. Refresh page
4. Try connecting again

**Solution C: Re-add Network**
1. In MetaMask, go to Settings → Networks
2. Remove "Hardhat Local" if it exists
3. Add it again:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
4. Switch to Hardhat Local
5. Try connecting again

**Solution D: Restart Everything**
1. Stop the blockchain (Ctrl+C in Terminal 1)
2. Stop the server (Ctrl+C in Terminal 2)
3. Close browser
4. Restart blockchain: `npm run node`
5. Restart server: `npm start`
6. Open browser and try again

---

## Quick Debug Checklist

- [ ] MetaMask extension is installed and enabled
- [ ] MetaMask is unlocked
- [ ] Network is "Hardhat Local" (Chain ID: 31337)
- [ ] Account is imported with test ETH
- [ ] Browser console shows no errors
- [ ] Blockchain is running (`npm run node`)
- [ ] Server is running (`npm start`)
- [ ] No popup blockers active

---

## Still Not Working?

1. **Check Browser Console** (F12 → Console)
   - Look for specific error messages
   - Share the error with support

2. **Check Network Tab** (F12 → Network)
   - Look for failed requests to `/api/contract`
   - Check if server is responding

3. **Try Different Browser**
   - Chrome, Firefox, Edge, Brave all work
   - Some browsers have better MetaMask support

4. **Check MetaMask Logs**
   - In MetaMask, go to Settings → Advanced
   - Enable "Show incoming transactions"
   - Check if connection requests appear

---

## Expected Behavior

When you click "Connect MetaMask":
1. ✅ MetaMask popup appears
2. ✅ Shows "Connect to IP Shield" or similar
3. ✅ Lists permissions requested
4. ✅ You click "Connect" or "Next"
5. ✅ Popup closes
6. ✅ Wallet address appears in app
7. ✅ Success message shows

If any step fails, that's where the issue is!

---

## Quick Test

Open browser console (F12) and run:
```javascript
// Check if MetaMask is detected
console.log('MetaMask detected:', typeof window.ethereum !== 'undefined');

// Check current network
window.ethereum.request({ method: 'eth_chainId' }).then(id => 
    console.log('Chain ID:', parseInt(id, 16))
);

// Try to get accounts
window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => 
    console.log('Accounts:', accounts)
);
```

This will help identify where the issue is!

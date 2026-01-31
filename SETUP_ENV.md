# ⚙️ Setup .env File for Testnet Deployment

## Step 1: Get Your Private Key

**⚠️ SECURITY WARNING:** Only use a test wallet! Never use your main wallet's private key.

1. **Open MetaMask**
2. **Click your account icon** (top right)
3. **Click "Account details"**
4. **Click "Show private key"**
5. **Enter your MetaMask password**
6. **Copy the private key** (long string starting with 0x...)

---

## Step 2: Edit .env File

1. **Open the `.env` file** in the `bc` folder
2. **Update these values:**

```env
# Network Configuration
NETWORK=mumbai
PORT=3000

# Wallet Private Key (the one you copied from MetaMask)
PRIVATE_KEY=your_private_key_here

# Mumbai Testnet RPC URL
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

3. **Replace `your_private_key_here`** with your actual private key
4. **Save the file**

---

## Important Notes

- ✅ Use the private key from the wallet that has test MATIC
- ✅ Private key can have or not have `0x` prefix (both work)
- ✅ Make sure there are no extra spaces
- ✅ Never commit `.env` to GitHub!

---

## Ready to Deploy?

Once your `.env` file is configured:
```bash
npm run compile
npm run deploy:mumbai
```

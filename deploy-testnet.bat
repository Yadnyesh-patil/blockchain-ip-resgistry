@echo off
echo ========================================
echo   IP Registry - Testnet Deployment
echo ========================================
echo.

echo This script will deploy to Mumbai testnet (Polygon)
echo Make sure you have:
echo 1. Created .env file with PRIVATE_KEY and MUMBAI_RPC_URL
echo 2. Test MATIC in your wallet
echo 3. Network configured in hardhat.config.js
echo.

pause

echo [1/3] Compiling smart contracts...
call npm run compile
if errorlevel 1 (
    echo ERROR: Failed to compile contracts
    pause
    exit /b 1
)
echo Contracts compiled!
echo.

echo [2/3] Deploying to Mumbai testnet...
echo This may take a few minutes...
call npm run deploy:mumbai
if errorlevel 1 (
    echo ERROR: Deployment failed
    echo Check your .env file and network configuration
    pause
    exit /b 1
)
echo.
echo Deployment successful!
echo.

echo [3/3] Setting up environment...
echo.
echo IMPORTANT: Update your .env file with:
echo NETWORK=mumbai
echo CONTRACT_ADDRESS=0x... (from deployment output above)
echo.

echo ========================================
echo   Next Steps
echo ========================================
echo 1. Update .env file with contract address
echo 2. Start server: npm start
echo 3. Configure MetaMask for Mumbai testnet
echo.

pause

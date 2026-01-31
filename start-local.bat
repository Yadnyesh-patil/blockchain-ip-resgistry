@echo off
echo ========================================
echo   IP Registry - Local Server Setup
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

echo [3/4] Compiling smart contracts...
call npm run compile
if errorlevel 1 (
    echo ERROR: Failed to compile contracts
    pause
    exit /b 1
)
echo Contracts compiled!
echo.

echo ========================================
echo   IMPORTANT: Next Steps
echo ========================================
echo.
echo 1. Open a NEW terminal and run:
echo    npm run node
echo    (Keep it running!)
echo.
echo 2. In that terminal, wait for the blockchain to start
echo    Then come back here and press any key to continue...
echo.
pause

echo [4/4] Deploying contract to local network...
call npm run deploy:local
if errorlevel 1 (
    echo ERROR: Failed to deploy contract
    echo Make sure Hardhat node is running in another terminal!
    pause
    exit /b 1
)
echo Contract deployed!
echo.

echo ========================================
echo   Starting Server...
echo ========================================
echo.
echo Server will start at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

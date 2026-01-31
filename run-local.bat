@echo off
echo ========================================
echo   IP Registry - Local Server Setup
echo ========================================
echo.

echo This will help you run the app locally for testing.
echo You need TWO terminal windows for this.
echo.

echo [Step 1] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [Step 2] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

echo [Step 3] Compiling smart contracts...
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
echo 1. Open a NEW terminal/PowerShell window
echo 2. Navigate to this directory:
echo    cd "C:\Users\Lenovo\OneDrive\Desktop\GDGC project\blockchain\bc"
echo 3. Run this command:
echo    npm run node
echo.
echo 4. Keep that terminal running (don't close it!)
echo 5. Come back here and press any key to continue...
echo.
pause

echo [Step 4] Deploying contract to local network...
call npm run deploy:local
if errorlevel 1 (
    echo ERROR: Failed to deploy contract
    echo Make sure you started the blockchain in another terminal!
    echo Run: npm run node
    pause
    exit /b 1
)
echo Contract deployed successfully!
echo.

echo [Step 5] Starting server...
echo.
echo ========================================
echo   Server Starting...
echo ========================================
echo.
echo Your app will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

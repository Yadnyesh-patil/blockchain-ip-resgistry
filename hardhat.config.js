require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Helper to ensure private key has 0x prefix
const getPrivateKey = () => {
  const key = process.env.PRIVATE_KEY;
  if (!key) {
    console.log("DEBUG: PRIVATE_KEY is undefined or empty");
    return [];
  }
  if (key === "your_private_key_here") {
    console.log("DEBUG: PRIVATE_KEY is default placeholder");
    return [];
  }
  console.log("DEBUG: PRIVATE_KEY loaded (length: " + key.length + ")");
  return [key.startsWith("0x") ? key : "0x" + key];
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: getPrivateKey(),
      chainId: 80002
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: getPrivateKey(),
      chainId: 11155111
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: getPrivateKey(),
      chainId: 137
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/dummy",
      accounts: getPrivateKey(),
      chainId: 1
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

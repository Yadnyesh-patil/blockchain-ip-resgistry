const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying IPRegistry contract...");

    // Get the contract factory
    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
        throw new Error("No signer available! Check hardhat.config.js and .env");
    }
    console.log("Deploying contracts with the account:", deployer.address);
    // details
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    const IPRegistry = await hre.ethers.getContractFactory("IPRegistry");

    // Deploy the contract
    const ipRegistry = await IPRegistry.deploy();

    // Wait for deployment to complete
    await ipRegistry.waitForDeployment();

    const contractAddress = await ipRegistry.getAddress();

    console.log(`IPRegistry deployed to: ${contractAddress}`);
    console.log(`Network: ${hre.network.name}`);

    // Save the contract address to a file for the frontend
    const deploymentInfo = {
        address: contractAddress,
        network: hre.network.name,
        deployedAt: new Date().toISOString()
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentsDir, `${hre.network.name}.json`),
        JSON.stringify(deploymentInfo, null, 2)
    );

    // Also update the frontend config
    const frontendConfigPath = path.join(__dirname, "..", "frontend", "js", "config.js");
    const configContent = `// Auto-generated deployment configuration
const CONTRACT_CONFIG = {
  address: "${contractAddress}",
  network: "${hre.network.name}",
  deployedAt: "${new Date().toISOString()}"
};

export default CONTRACT_CONFIG;
`;

    fs.writeFileSync(frontendConfigPath, configContent);
    console.log(`Frontend config updated at: ${frontendConfigPath}`);

    // Copy ABI to frontend
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "IPRegistry.sol", "IPRegistry.json");
    if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        const abiPath = path.join(__dirname, "..", "frontend", "js", "abi.js");
        const abiContent = `// Auto-generated contract ABI
const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};

export default CONTRACT_ABI;
`;
        fs.writeFileSync(abiPath, abiContent);
        console.log(`Contract ABI copied to: ${abiPath}`);
    }

    console.log("\nDeployment complete!");
    console.log("Next steps:");
    console.log("1. Start the backend server: npm start");
    console.log("2. Open frontend/index.html in your browser");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

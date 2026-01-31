const hre = require("hardhat");

async function main() {
    console.log("Checking Hardhat configuration...");
    console.log("Network:", hre.network.name);
    console.log("Chain ID:", hre.network.config.chainId);

    try {
        const signers = await hre.ethers.getSigners();
        console.log("Signers found:", signers.length);

        if (signers.length > 0) {
            const deployer = signers[0];
            console.log("Deployer address:", deployer.address);
            const balance = await hre.ethers.provider.getBalance(deployer.address);
            console.log("Balance:", hre.ethers.formatEther(balance), "ETH/MATIC");
        } else {
            console.log("No signers configured!");
        }
    } catch (error) {
        console.error("Error accessing signers:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

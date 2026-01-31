const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Checking balance for address:", deployer.address);

    const checkBalance = async (networkName, rpcUrl) => {
        try {
            const provider = new hre.ethers.JsonRpcProvider(rpcUrl);
            const balance = await provider.getBalance(deployer.address);
            console.log(`\n[${networkName}] Balance: ${hre.ethers.formatEther(balance)}`);
        } catch (e) {
            console.log(`\n[${networkName}] Error: ${e.message}`);
        }
    };

    await checkBalance("Polygon Amoy", process.env.AMOY_RPC_URL);
    await checkBalance("Sepolia", process.env.SEPOLIA_RPC_URL);
}

main().catch(console.error);

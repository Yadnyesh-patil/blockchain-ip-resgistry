require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
    const key = process.env.PRIVATE_KEY;
    if (!key) {
        console.log("No PRIVATE_KEY found in .env");
        return;
    }

    try {
        // Handle potential 0x prefix issues
        const formattedKey = key.startsWith("0x") ? key : "0x" + key;
        const wallet = new ethers.Wallet(formattedKey);
        console.log("---------------------------------------------------");
        console.log("Private Key loads successfully!");
        console.log("Derived Address: " + wallet.address);
        console.log("---------------------------------------------------");

        if (wallet.address.toLowerCase() === "0x86379448424da20ea7394876c4342007337d71ac".toLowerCase()) {
            console.log("MATCH CONFIRMED: This is the correct account.");
        } else {
            console.log("MISMATCH: This is NOT account 0x8637...D71ac");
        }
    } catch (error) {
        console.error("Invalid Private Key format:", error.message);
    }
}

main();

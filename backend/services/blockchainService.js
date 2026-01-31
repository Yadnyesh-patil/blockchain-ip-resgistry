const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');

/**
 * Blockchain Service - Handles all blockchain interactions
 */
class BlockchainService {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.signer = null;
        this.initialized = false;
    }

    /**
     * Initialize the blockchain connection
     * @param {string} rpcUrl - The RPC URL to connect to
     * @param {string} contractAddress - The deployed contract address
     * @param {string} privateKey - Optional private key for signing transactions
     */
    async initialize(rpcUrl, contractAddress, privateKey = null) {
        try {
            // Create provider
            this.provider = new ethers.JsonRpcProvider(rpcUrl);

            // Load contract ABI
            const artifactPath = path.join(__dirname, '..', '..', 'artifacts', 'contracts', 'IPRegistry.sol', 'IPRegistry.json');

            if (!fs.existsSync(artifactPath)) {
                throw new Error('Contract artifact not found. Please compile the contract first: npm run compile');
            }

            const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

            // Create signer if private key provided
            if (privateKey) {
                this.signer = new ethers.Wallet(privateKey, this.provider);
                this.contract = new ethers.Contract(contractAddress, artifact.abi, this.signer);
            } else {
                this.contract = new ethers.Contract(contractAddress, artifact.abi, this.provider);
            }

            // Verify contract code exists
            const code = await this.provider.getCode(contractAddress);
            if (code === '0x') {
                console.warn(`WARNING: No code found at ${contractAddress}. The blockchain might have been restarted.`);
                this.initialized = false;
                // Don't throw here, let requests fail gracefully with specific check
            } else {
                this.initialized = true;
                console.log('Blockchain service initialized');
                console.log(`Contract address: ${contractAddress}`);
            }

            return true;
        } catch (error) {
            console.error('Failed to initialize blockchain service:', error.message);
            // Don't throw, just allow retry later
        }
    }

    /**
     * Check if a file hash is already registered
     * @param {string} fileHash - The SHA-256 hash to check
     * @returns {Promise<boolean>} - True if registered
     */
    async isRegistered(fileHash) {
        await this._checkInitialized();
        return await this.contract.isRegistered(fileHash);
    }

    /**
     * Get IP details for a hash
     * @param {string} fileHash - The SHA-256 hash to look up
     * @returns {Promise<Object>} - The IP record details
     */
    async getIPDetails(fileHash) {
        await this._checkInitialized();
        const result = await this.contract.getIPDetails(fileHash);

        return {
            owner: result[0],
            title: result[1],
            description: result[2],
            timestamp: Number(result[3]),
            exists: result[4]
        };
    }

    /**
     * Verify ownership of a hash
     * @param {string} fileHash - The SHA-256 hash to verify
     * @returns {Promise<Object>} - Owner and timestamp info
     */
    async verifyOwnership(fileHash) {
        await this._checkInitialized();
        const result = await this.contract.verifyOwnership(fileHash);

        return {
            owner: result[0],
            timestamp: Number(result[1]),
            exists: result[2]
        };
    }

    /**
     * Get all records for an owner
     * @param {string} ownerAddress - The owner's wallet address
     * @returns {Promise<string[]>} - Array of file hashes
     */
    async getRecordsByOwner(ownerAddress) {
        await this._checkInitialized();
        return await this.contract.getRecordsByOwner(ownerAddress);
    }

    /**
     * Get total registration count
     * @returns {Promise<number>} - Total registrations
     */
    async getTotalRegistrations() {
        await this._checkInitialized();
        const total = await this.contract.totalRegistrations();
        return Number(total);
    }

    /**
     * Register IP (requires signer)
     * @param {string} fileHash - The SHA-256 hash
     * @param {string} title - Title of the IP
     * @param {string} description - Description of the IP
     * @returns {Promise<Object>} - Transaction receipt
     */
    async registerIP(fileHash, title, description) {
        await this._checkInitialized();

        if (!this.signer) {
            throw new Error('Signer required for registration. Initialize with a private key.');
        }

        const tx = await this.contract.registerIP(fileHash, title, description);
        const receipt = await tx.wait();

        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        };
    }

    /**
     * Check if service is initialized
     * @private
     */
    /**
     * Check if service is initialized
     * @private
     */
    async _checkInitialized() {
        if (!this.initialized) {
            throw new Error('Blockchain service not fully initialized (Contract not found on network).');
        }

        // Optional: Periodic check could go here, but for now we rely on initial check
        // To be robust against restarts while running:
        if (this.contract && this.provider) {
            try {
                // Quick check if code still exists (cache this if performance is an issue)
                // const code = await this.provider.getCode(this.contract.target);
                // if (code === '0x') throw new Error('Contract code missing');
            } catch (e) {
                this.initialized = false;
                throw new Error('Blockchain network connection lost or contract missing.');
            }
        }
    }
}

// Singleton instance
const blockchainService = new BlockchainService();

module.exports = blockchainService;

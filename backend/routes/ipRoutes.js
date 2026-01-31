const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const HashService = require('../services/hashService');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Initialize blockchain service (will be called when server starts)
let blockchainInitialized = false;

const initBlockchain = async () => {
    try {
        const network = 'sepolia'; // Force Sepolia for debugging
        console.log("DEBUG: Forcing Network to:", network);
        // const network = process.env.NETWORK || 'localhost';
        let deploymentPath;
        let rpcUrl;

        // Determine network configuration
        switch (network.toLowerCase()) {
            case 'mumbai':
                rpcUrl = process.env.MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com';
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'mumbai.json');
                break;
            case 'sepolia':
                rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'sepolia.json');
                break;
            case 'polygon':
                rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'polygon.json');
                break;
            case 'mainnet':
                rpcUrl = process.env.MAINNET_RPC_URL;
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'mainnet.json');
                break;
            default: // localhost
                rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'localhost.json');
        }

        // Check if deployment config exists
        if (fs.existsSync(deploymentPath)) {
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            const contractAddress = process.env.CONTRACT_ADDRESS || deployment.address;

            if (!contractAddress) {
                throw new Error('Contract address not found. Please deploy the contract first.');
            }

            if (!rpcUrl) {
                throw new Error(`RPC URL not configured for network: ${network}`);
            }

            await blockchainService.initialize(
                rpcUrl,
                contractAddress,
                process.env.PRIVATE_KEY || null
            );
            blockchainInitialized = true;
            console.log(`Blockchain service connected to ${network} network`);
            console.log(`Contract address: ${contractAddress}`);
            console.log(`RPC URL: ${rpcUrl}`);
        } else {
            console.log(`No deployment found for ${network}. Run deployment script first.`);
            console.log(`Expected deployment file: ${deploymentPath}`);
        }
    } catch (error) {
        console.log('Blockchain not connected:', error.message);
    }
};

// Initialize on module load
initBlockchain();

/**
 * POST /api/hash
 * Upload a file and get its SHA-256 hash
 */
router.post('/hash', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileHash = HashService.hashBuffer(req.file.buffer);

        res.json({
            success: true,
            hash: fileHash,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });
    } catch (error) {
        console.error('Hash error:', error);
        res.status(500).json({ error: 'Failed to hash file', message: error.message });
    }
});

/**
 * GET /api/verify/:hash
 * Verify ownership of a file hash
 */
router.get('/verify/:hash', async (req, res) => {
    try {
        const { hash } = req.params;

        if (!hash || hash.length !== 64) {
            return res.status(400).json({ error: 'Invalid hash format. Expected 64-character hex string.' });
        }

        if (!blockchainInitialized) {
            return res.status(503).json({
                error: 'Blockchain not connected',
                message: 'Please ensure the local blockchain is running and contract is deployed.'
            });
        }

        const details = await blockchainService.getIPDetails(hash);

        if (!details.exists) {
            return res.json({
                registered: false,
                message: 'This hash is not registered on the blockchain.'
            });
        }

        res.json({
            registered: true,
            owner: details.owner,
            title: details.title,
            description: details.description,
            timestamp: details.timestamp,
            registeredAt: new Date(details.timestamp * 1000).toISOString()
        });
    } catch (error) {
        console.error('Verify error:', error);
        if (error.message.includes('not fully initialized') || error.message.includes('not connected')) {
            return res.status(503).json({
                error: 'Blockchain Unavailable',
                message: 'The blockchain service is not connected.'
            });
        }
        res.status(500).json({ error: 'Verification failed', message: error.message });
    }
});

/**
 * GET /api/check/:hash
 * Quick check if a hash is registered
 */
router.get('/check/:hash', async (req, res) => {
    try {
        const { hash } = req.params;

        if (!blockchainInitialized) {
            return res.status(503).json({
                error: 'Blockchain not connected'
            });
        }

        const isRegistered = await blockchainService.isRegistered(hash);

        res.json({
            hash: hash,
            isRegistered: isRegistered
        });
    } catch (error) {
        console.error('Check error:', error);
        res.status(500).json({ error: 'Check failed', message: error.message });
    }
});

/**
 * GET /api/records/:address
 * Get all IP records for an owner address
 */
router.get('/records/:address', async (req, res) => {
    try {
        const { address } = req.params;

        if (!blockchainInitialized) {
            return res.status(503).json({
                error: 'Blockchain not connected'
            });
        }

        const hashes = await blockchainService.getRecordsByOwner(address);

        // Get details for each hash
        const records = await Promise.all(
            hashes.map(async (hash) => {
                const details = await blockchainService.getIPDetails(hash);
                return {
                    hash: hash,
                    ...details,
                    registeredAt: new Date(details.timestamp * 1000).toISOString()
                };
            })
        );

        res.json({
            owner: address,
            count: records.length,
            records: records
        });
    } catch (error) {
        console.error('Records error:', error);
        if (error.message.includes('not fully initialized') || error.message.includes('not connected')) {
            return res.status(503).json({
                error: 'Blockchain Unavailable',
                message: 'The blockchain service is not connected.'
            });
        }
        res.status(500).json({ error: 'Failed to fetch records', message: error.message });
    }
});

/**
 * GET /api/stats
 * Get blockchain statistics
 */
router.get('/stats', async (req, res) => {
    try {
        if (!blockchainInitialized) {
            return res.status(503).json({
                error: 'Blockchain not connected'
            });
        }

        const totalRegistrations = await blockchainService.getTotalRegistrations();

        res.json({
            totalRegistrations: totalRegistrations,
            blockchainConnected: true
        });
    } catch (error) {
        console.error('Stats error:', error);
        if (error.message.includes('not fully initialized') || error.message.includes('not connected')) {
            return res.status(503).json({
                error: 'Blockchain Unavailable',
                message: 'The blockchain service is not connected. Please check if the local node is running.'
            });
        }
        res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
    }
});

/**
 * GET /api/contract
 * Get contract info for frontend
 */
router.get('/contract', (req, res) => {
    try {
        const network = process.env.NETWORK || 'localhost';
        let deploymentPath;

        // Determine deployment path based on network
        switch (network.toLowerCase()) {
            case 'mumbai':
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'mumbai.json');
                break;
            case 'sepolia':
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'sepolia.json');
                break;
            case 'polygon':
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'polygon.json');
                break;
            case 'mainnet':
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'mainnet.json');
                break;
            default:
                deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'localhost.json');
        }

        if (fs.existsSync(deploymentPath)) {
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            res.json({
                ...deployment,
                connected: blockchainInitialized,
                network: network
            });
        } else {
            res.json({
                deployed: false,
                network: network,
                message: `Contract not deployed to ${network}. Run deployment script first.`
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get contract info', message: error.message });
    }
});

module.exports = router;

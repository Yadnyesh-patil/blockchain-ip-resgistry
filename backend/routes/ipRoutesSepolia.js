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
        console.log("------------------------------------------------");
        console.log("   FORCE SEPOLIA ROUTE LOADER ACTIVATED");
        console.log("------------------------------------------------");

        const network = 'sepolia';
        let deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'sepolia.json');
        let rpcUrl = 'https://ethereum-sepolia.publicnode.com';

        // Check if deployment config exists
        if (fs.existsSync(deploymentPath)) {
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            // Use address from file if not in env
            const contractAddress = process.env.CONTRACT_ADDRESS || deployment.address;

            if (!contractAddress) {
                throw new Error('Contract address not found.');
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
            console.log(`No deployment found for ${network}.`);
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
                message: 'Please ensure the blockchain is connected.'
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
        res.status(500).json({ error: 'Verification failed', message: error.message });
    }
});

/**
 * GET /api/contract
 * Get contract info for frontend
 */
router.get('/contract', (req, res) => {
    try {
        const deploymentPath = path.join(__dirname, '..', '..', 'deployments', 'sepolia.json');
        if (fs.existsSync(deploymentPath)) {
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            res.json({
                ...deployment,
                connected: blockchainInitialized,
                network: 'sepolia'
            });
        } else {
            res.json({ deployed: false, network: 'sepolia' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get contract info', message: error.message });
    }
});

// Implement other routes as needed or rely on existing logic (omitted for brevity as Verify is the blocker)
// Adding Check and Records routes just in case:

router.get('/check/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        if (!blockchainInitialized) return res.status(503).json({ error: 'Blockchain not connected' });
        const isRegistered = await blockchainService.isRegistered(hash);
        res.json({ hash: hash, isRegistered: isRegistered });
    } catch (error) {
        res.status(500).json({ error: 'Check failed', message: error.message });
    }
});

router.get('/records/:address', async (req, res) => {
    try {
        const { address } = req.params;
        if (!blockchainInitialized) return res.status(503).json({ error: 'Blockchain not connected' });
        const hashes = await blockchainService.getRecordsByOwner(address);

        // Fetch details sequentially to avoid RPC rate limiting
        const records = [];
        for (const hash of hashes) {
            try {
                const details = await blockchainService.getIPDetails(hash);
                records.push({
                    hash: hash,
                    ...details,
                    registeredAt: new Date(details.timestamp * 1000).toISOString()
                });
                // Small delay to be nice to public RPC
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (err) {
                console.error(`Failed to fetch details for hash ${hash}:`, err.message);
                // Continue with other records even if one fails
            }
        }

        res.json({ owner: address, count: records.length, records: records });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records', message: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        if (!blockchainInitialized) return res.status(503).json({ error: 'Blockchain not connected' });
        const totalRegistrations = await blockchainService.getTotalRegistrations();
        res.json({ totalRegistrations: totalRegistrations, blockchainConnected: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
    }
});

module.exports = router;

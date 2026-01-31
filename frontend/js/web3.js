/**
 * Web3 Service - Handles blockchain interactions
 * Uses Ethers.js for wallet connection and contract calls
 */

// Ethers.js is loaded via CDN in index.html
// Access via global window.ethers object

// Contract ABI (will be loaded from file after deployment)
let CONTRACT_ABI = null;
let CONTRACT_ADDRESS = null;

// State
let provider = null;
let signer = null;
let contract = null;
let walletAddress = null;

/**
 * Load contract configuration
 */
async function loadContractConfig() {
    try {
        // Try API first
        const response = await fetch('/api/contract');
        if (response.ok) {
            const config = await response.json();
            if (config.address) {
                CONTRACT_ADDRESS = config.address;
                console.log('Contract address loaded from API:', CONTRACT_ADDRESS);
                // Load ABI from artifacts
                await loadContractABI();
                return true;
            }
        }

        // Fallback: Try loading from config.js file
        try {
            const configModule = await import('./config.js');
            if (configModule.default && configModule.default.address) {
                CONTRACT_ADDRESS = configModule.default.address;
                console.log('Contract address loaded from config.js:', CONTRACT_ADDRESS);
                await loadContractABI();
                return true;
            }
        } catch (importError) {
            console.log('Could not load config.js:', importError);
        }
    } catch (error) {
        console.log('Contract config not available:', error.message);
    }

    // Use hardcoded address as last resort (from deployment)
    if (!CONTRACT_ADDRESS) {
        CONTRACT_ADDRESS = "0x93Eb2f88940778ae9B211065a03C488cB01BC761"; // Sepolia Address
        console.log('Using fallback contract address:', CONTRACT_ADDRESS);
        await loadContractABI();
        return true;
    }

    return false;
}

/**
 * Load contract ABI
 */
async function loadContractABI() {
    // ABI for IPRegistry contract
    CONTRACT_ABI = [
        "function registerIP(string memory _fileHash, string memory _title, string memory _description) external",
        "function isRegistered(string memory _fileHash) external view returns (bool)",
        "function verifyOwnership(string memory _fileHash) external view returns (address owner, uint256 timestamp, bool exists)",
        "function getIPDetails(string memory _fileHash) external view returns (address owner, string memory title, string memory description, uint256 timestamp, bool exists)",
        "function getRecordsByOwner(address _owner) external view returns (string[] memory)",
        "function totalRegistrations() external view returns (uint256)",
        "event IPRegistered(address indexed owner, string fileHash, string title, uint256 timestamp)"
    ];
}

/**
 * Check if MetaMask is installed
 */
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

/**
 * Connect to MetaMask wallet
 */
export async function connectWallet() {
    if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
        // Check network first
        let chainId = await requestWithRetry({ method: 'eth_chainId' });
        let chainIdNum = parseInt(chainId, 16);
        const expectedChainId = 11155111; // Sepolia Testnet

        // Wait a bit and check again
        await new Promise(resolve => setTimeout(resolve, 200));
        chainId = await window.ethereum.request({ method: 'eth_chainId' });
        chainIdNum = parseInt(chainId, 16);

        // If wrong network, try to switch
        if (chainIdNum !== expectedChainId) {
            console.log(`Current chain ID: ${chainIdNum}, expected: ${expectedChainId}`);

            try {
                // Try to switch to Sepolia
                await requestWithRetry({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
                });

                // Wait for network to switch
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check again after switch
                chainId = await window.ethereum.request({ method: 'eth_chainId' });
                chainIdNum = parseInt(chainId, 16);

                if (chainIdNum !== expectedChainId) {
                    // Network doesn't exist, try to add it
                    console.log('Network not found, attempting to add...');
                    try {
                        await requestWithRetry({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xaa36a7',
                                chainName: 'Sepolia Testnet',
                                nativeCurrency: {
                                    name: 'Sepolia ETH',
                                    symbol: 'SEP',
                                    decimals: 18
                                },
                                rpcUrls: ['https://rpc.sepolia.org'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io']
                            }],
                        });
                        // Wait for network to be added and switched
                        await new Promise(resolve => setTimeout(resolve, 1500));

                        // Final check
                        chainId = await window.ethereum.request({ method: 'eth_chainId' });
                        chainIdNum = parseInt(chainId, 16);

                        if (chainIdNum !== expectedChainId) {
                            throw new Error(`Please manually switch to Hardhat Local network in MetaMask. Current Chain ID: ${chainIdNum}`);
                        }
                    } catch (addError) {
                        console.error('Add network error:', addError);
                        throw new Error(`Please add Sepolia network manually:\nRPC URL: https://rpc.sepolia.org\nChain ID: 11155111\n\nError: ${addError.message}`);
                    }
                }
            } catch (switchError) {
                console.error('Switch network error:', switchError);
                // If switch fails, show helpful error
                if (switchError.code === 4902) {
                    // Network not added
                    throw new Error(`Sepolia network not found. Please add it manually in MetaMask.`);
                } else if (switchError.code === 4001) {
                    throw new Error('Network switch was rejected. Please switch to Sepolia manually in MetaMask.');
                } else {
                    throw new Error(`Please switch to Sepolia network in MetaMask (Chain ID: 11155111). Current: ${chainIdNum}\n\nIf Sepolia is already selected, try refreshing the page.`);
                }
            }
        }

        console.log(`Connected to network with Chain ID: ${chainIdNum}`);

        // Request account access
        const accounts = await requestWithRetry({ method: 'eth_requestAccounts' });

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please unlock MetaMask and try again.');
        }

        walletAddress = accounts[0];

        // Create ethers provider and signer
        // Use window.ethers if ethers is loaded via CDN
        const ethersLib = window.ethers || ethers;
        provider = new ethersLib.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Load contract config if not loaded
        if (!CONTRACT_ADDRESS) {
            const loaded = await loadContractConfig();
            if (!loaded) {
                console.warn('Contract config not loaded, but continuing...');
            }
        }

        // Load ABI if not loaded
        if (!CONTRACT_ABI) {
            await loadContractABI();
        }

        // Create contract instance
        if (CONTRACT_ADDRESS && CONTRACT_ABI) {
            const ethersLib = window.ethers || ethers;

            // Validate that code exists at the address
            const code = await provider.getCode(CONTRACT_ADDRESS);
            if (code === '0x') {
                console.warn('Contract code missing at', CONTRACT_ADDRESS);
                throw new Error(`Contract not deployed at ${CONTRACT_ADDRESS}. Please redeploy contract or update address.`);
            }

            contract = new ethersLib.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            console.log('Contract instance created:', CONTRACT_ADDRESS);
        } else {
            console.warn('Contract address or ABI not available:', { CONTRACT_ADDRESS, hasABI: !!CONTRACT_ABI });
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Chain changed to:', parseInt(chainId, 16));
            // Reload page when chain changes
            window.location.reload();
        });

        return walletAddress;
    } catch (error) {
        console.error('Error connecting wallet:', error);

        // Provide more specific error messages
        if (error.code === 4001) {
            throw new Error('Connection rejected. Please approve the connection in MetaMask.');
        } else if (error.code === -32002) {
            throw new Error('Connection request already pending. Please check MetaMask.');
        } else if (error.message) {
            throw error; // Re-throw with original message
        } else if (error.message && error.message.includes('Contract not deployed')) {
            throw error; // Re-throw contract missing error
        } else {
            throw new Error(`Failed to connect wallet: ${error.code || error.message || 'Unknown error'}`);
        }
    }
}

/**
 * Handle account changes
 */
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        walletAddress = null;
        signer = null;
        contract = null;
    } else {
        walletAddress = accounts[0];
        window.location.reload();
    }
}

/**
 * Get current wallet address
 */
export function getWalletAddress() {
    return walletAddress;
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected() {
    return walletAddress !== null;
}

/**
 * Register IP on blockchain
 */
export async function registerOnBlockchain(fileHash, title, description) {
    if (!contract) {
        // If no contract, use simulation mode
        console.log('Contract not available, using simulation mode');
        return simulateRegistration(fileHash, title, description);
    }

    try {
        const tx = await contract.registerIP(fileHash, title, description);
        const receipt = await tx.wait();

        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        };
    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 'ACTION_REJECTED') {
            throw new Error('Transaction was rejected by user');
        }

        throw new Error(error.message || 'Registration failed');
    }
}

/**
 * Check if hash exists on blockchain
 */
export async function checkHashOnChain(fileHash) {
    // Try API first
    try {
        const response = await fetch(`/api/verify/${fileHash}`);
        if (response.ok) {
            const data = await response.json();
            return {
                registered: data.registered,
                owner: data.owner,
                title: data.title,
                description: data.description,
                timestamp: data.timestamp
            };
        }
    } catch (error) {
        console.log('API verification failed, trying contract directly');
    }

    // Fall back to contract
    if (contract) {
        try {
            const result = await contract.getIPDetails(fileHash);
            return {
                registered: result[4],
                owner: result[0],
                title: result[1],
                description: result[2],
                timestamp: Number(result[3])
            };
        } catch (error) {
            console.error('Contract query error:', error);
        }
    }

    // Default: not registered
    return { registered: false };
}

/**
 * Simulation mode for development/demo
 */
function simulateRegistration(fileHash, title, description) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                transactionHash: '0x' + generateRandomHex(64),
                blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
                gasUsed: '150000'
            });
        }, 2000);
    });
}

function generateRandomHex(length) {
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Helper to retry RPC requests on backoff
 */
async function requestWithRetry(args, retries = 3, delay = 1000) {
    try {
        return await window.ethereum.request(args);
    } catch (error) {
        // Retry on "resource unavailable" or rate limit errors
        if (retries > 0 && (error.code === -32002 || error.code === 429)) {
            console.log(`RPC Error ${error.code}, retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            return requestWithRetry(args, retries - 1, delay * 2);
        }
        throw error;
    }
}

// Initialize on load
loadContractConfig();

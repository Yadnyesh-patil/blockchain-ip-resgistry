/**
 * IP Shield - Main Application Logic
 * Handles file uploads, hashing, and UI interactions
 */

import { connectWallet, getWalletAddress, isWalletConnected, registerOnBlockchain, checkHashOnChain } from './web3.js';
import { hashFile } from './hash.js';

// DOM Elements
const elements = {
    // Navigation
    connectWalletBtn: document.getElementById('connectWallet'),

    // Hero
    totalRegistrations: document.getElementById('totalRegistrations'),

    // Register Section
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    filePreview: document.getElementById('filePreview'),
    fileName: document.getElementById('fileName'),
    fileSize: document.getElementById('fileSize'),
    fileHash: document.getElementById('fileHash'),
    removeFile: document.getElementById('removeFile'),
    copyHash: document.getElementById('copyHash'),
    hashStatus: document.getElementById('hashStatus'),

    nextStep1: document.getElementById('nextStep1'),
    backStep2: document.getElementById('backStep2'),
    backStep3: document.getElementById('backStep3'),

    ipDetailsForm: document.getElementById('ipDetailsForm'),
    ipTitle: document.getElementById('ipTitle'),
    ipDescription: document.getElementById('ipDescription'),

    summaryFile: document.getElementById('summaryFile'),
    summaryTitle: document.getElementById('summaryTitle'),
    summaryHash: document.getElementById('summaryHash'),

    walletNotConnected: document.getElementById('walletNotConnected'),
    walletConnected: document.getElementById('walletConnected'),
    walletAddress: document.getElementById('walletAddress'),
    connectWalletStep3: document.getElementById('connectWalletStep3'),
    registerBtn: document.getElementById('registerBtn'),

    txStatus: document.getElementById('txStatus'),
    txPending: document.getElementById('txPending'),
    txSuccess: document.getElementById('txSuccess'),
    txError: document.getElementById('txError'),
    txHash: document.getElementById('txHash'),
    txBlock: document.getElementById('txBlock'),
    txErrorMsg: document.getElementById('txErrorMsg'),

    viewCertificate: document.getElementById('viewCertificate'),
    registerAnother: document.getElementById('registerAnother'),
    retryTx: document.getElementById('retryTx'),

    // Verify Section
    verifyTabs: document.querySelectorAll('.verify-tab'),
    verifyTabContents: document.querySelectorAll('.verify-tab-content'),
    verifyUploadZone: document.getElementById('verifyUploadZone'),
    verifyFileInput: document.getElementById('verifyFileInput'),
    verifyHash: document.getElementById('verifyHash'),
    verifyHashBtn: document.getElementById('verifyHashBtn'),
    verifyResult: document.getElementById('verifyResult'),
    resultFound: document.getElementById('resultFound'),
    resultNotFound: document.getElementById('resultNotFound'),
    resultOwner: document.getElementById('resultOwner'),
    resultTitle: document.getElementById('resultTitle'),
    resultDate: document.getElementById('resultDate'),
    resultDescription: document.getElementById('resultDescription'),
    resultHash: document.getElementById('resultHash'),

    // Records Section
    recordsEmpty: document.getElementById('recordsEmpty'),
    recordsGrid: document.getElementById('recordsGrid'),
    recordsLoading: document.getElementById('recordsLoading'),
    connectWalletRecords: document.getElementById('connectWalletRecords'),

    // Certificate Modal
    certificateModal: document.getElementById('certificateModal'),
    closeCertificate: document.getElementById('closeCertificate'),
    downloadCertificate: document.getElementById('downloadCertificate'),
    certTitle: document.getElementById('certTitle'),
    certOwner: document.getElementById('certOwner'),
    certDate: document.getElementById('certDate'),
    certHash: document.getElementById('certHash'),
    certTxHash: document.getElementById('certTxHash'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// State
let currentFile = null;
let currentHash = null;
let currentStep = 1;
let lastTxData = null;
let isHashRegistered = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadStats();
    checkWalletConnection();
});

function initializeEventListeners() {
    // Connect Wallet buttons
    elements.connectWalletBtn.addEventListener('click', handleConnectWallet);
    elements.connectWalletStep3?.addEventListener('click', handleConnectWallet);
    elements.connectWalletRecords?.addEventListener('click', handleConnectWallet);

    // File Upload
    elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
    elements.uploadZone.addEventListener('dragover', handleDragOver);
    elements.uploadZone.addEventListener('dragleave', handleDragLeave);
    elements.uploadZone.addEventListener('drop', handleDrop);
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.removeFile.addEventListener('click', handleRemoveFile);
    elements.copyHash.addEventListener('click', handleCopyHash);

    // Step Navigation
    elements.nextStep1.addEventListener('click', () => goToStep(2));
    elements.backStep2.addEventListener('click', () => goToStep(1));
    elements.backStep3.addEventListener('click', () => goToStep(2));

    // Form Submission
    elements.ipDetailsForm.addEventListener('submit', handleDetailsSubmit);

    // Register
    elements.registerBtn.addEventListener('click', handleRegister);
    elements.registerAnother.addEventListener('click', resetRegistration);
    elements.retryTx.addEventListener('click', handleRegister);
    elements.viewCertificate.addEventListener('click', showCertificate);

    // Verify Section
    elements.verifyTabs.forEach(tab => {
        tab.addEventListener('click', () => switchVerifyTab(tab.dataset.tab));
    });
    elements.verifyUploadZone.addEventListener('click', () => elements.verifyFileInput.click());
    elements.verifyUploadZone.addEventListener('dragover', handleDragOver);
    elements.verifyUploadZone.addEventListener('dragleave', handleDragLeave);
    elements.verifyUploadZone.addEventListener('drop', handleVerifyDrop);
    elements.verifyFileInput.addEventListener('change', handleVerifyFileSelect);
    elements.verifyHashBtn.addEventListener('click', handleVerifyByHash);

    // Certificate Modal
    elements.closeCertificate.addEventListener('click', hideCertificate);
    elements.certificateModal.querySelector('.modal-overlay').addEventListener('click', hideCertificate);
    elements.downloadCertificate.addEventListener('click', downloadCertificateAsPNG);
}

// Wallet Connection
async function handleConnectWallet() {
    try {
        const address = await connectWallet();
        updateWalletUI(address);
        showToast('Wallet connected successfully!', 'success');
        loadMyRecords();
    } catch (error) {
        console.error('Wallet connection error:', error);

        let errorMessage = error.message || 'Failed to connect wallet';

        if (error.message.includes('MetaMask is not installed')) {
            showToast('MetaMask is required. Install it from: https://metamask.io/download/', 'error');
            setTimeout(() => {
                if (confirm('MetaMask is not installed. Would you like to open the download page?')) {
                    window.open('https://metamask.io/download/', '_blank');
                }
            }, 500);
        } else if (error.message.includes('Wrong network')) {
            showToast(error.message, 'error');
            // Show alert with instructions
            setTimeout(() => {
                alert('Please switch to Hardhat Local network in MetaMask:\n\n1. Click network dropdown in MetaMask\n2. Select "Hardhat Local"\n3. Or add it manually:\n   - RPC URL: http://127.0.0.1:8545\n   - Chain ID: 31337');
            }, 500);
        } else if (error.message.includes('rejected')) {
            showToast('Connection was rejected. Please try again and approve in MetaMask.', 'error');
        } else {
            showToast(errorMessage, 'error');
        }
    }
}

async function checkWalletConnection() {
    if (isWalletConnected()) {
        const address = getWalletAddress();
        updateWalletUI(address);
        loadMyRecords();
    }
}

function updateWalletUI(address) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    elements.connectWalletBtn.innerHTML = `
    <span class="wallet-dot"></span>
    <span>${shortAddress}</span>
  `;

    elements.walletNotConnected.classList.add('hidden');
    elements.walletConnected.classList.remove('hidden');
    elements.walletAddress.textContent = shortAddress;
    elements.registerBtn.disabled = false;

    elements.recordsEmpty.classList.add('hidden');
    elements.recordsGrid.classList.remove('hidden');
}

// File Handling
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) processFile(file);
}

async function processFile(file) {
    currentFile = file;

    // Update UI
    elements.uploadZone.classList.add('hidden');
    elements.filePreview.classList.remove('hidden');
    elements.fileName.textContent = file.name;
    elements.fileSize.textContent = formatFileSize(file.size);

    // Show loading state
    showHashStatus('checking');

    try {
        // Generate hash
        currentHash = await hashFile(file);
        elements.fileHash.textContent = currentHash;

        // Check if registered
        const checkResult = await checkHashOnChain(currentHash);
        isHashRegistered = checkResult.registered;

        if (isHashRegistered) {
            showHashStatus('exists');
            elements.nextStep1.textContent = 'View Existing Registration';
        } else {
            showHashStatus('new');
            elements.nextStep1.innerHTML = `
        Continue to Details
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      `;
        }
    } catch (error) {
        console.error('Error processing file:', error);
        showToast('Error processing file', 'error');
    }
}

function showHashStatus(status) {
    const statusChecking = elements.hashStatus.querySelector('.status-checking');
    const statusNew = elements.hashStatus.querySelector('.status-new');
    const statusExists = elements.hashStatus.querySelector('.status-exists');

    statusChecking.classList.add('hidden');
    statusNew.classList.add('hidden');
    statusExists.classList.add('hidden');

    if (status === 'checking') {
        statusChecking.classList.remove('hidden');
    } else if (status === 'new') {
        statusNew.classList.remove('hidden');
    } else if (status === 'exists') {
        statusExists.classList.remove('hidden');
    }
}

function handleRemoveFile() {
    currentFile = null;
    currentHash = null;
    isHashRegistered = false;
    elements.fileInput.value = '';
    elements.uploadZone.classList.remove('hidden');
    elements.filePreview.classList.add('hidden');
}

function handleCopyHash() {
    navigator.clipboard.writeText(currentHash);
    showToast('Hash copied to clipboard', 'success');
}

// Step Navigation
function goToStep(step) {
    // If hash exists and trying to go to step 2, show verification instead
    if (step === 2 && isHashRegistered) {
        verifyHashAndShowResult(currentHash);
        return;
    }

    currentStep = step;

    // Update step indicators
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) el.classList.add('completed');
        if (index + 1 === step) el.classList.add('active');
    });

    // Show current step content
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.step-content[data-step="${step}"]`).classList.add('active');

    // Update summary if going to step 3
    if (step === 3) {
        elements.summaryFile.textContent = currentFile.name;
        elements.summaryTitle.textContent = elements.ipTitle.value;
        elements.summaryHash.textContent = currentHash;

        // Check wallet status
        if (!isWalletConnected()) {
            elements.walletNotConnected.classList.remove('hidden');
            elements.walletConnected.classList.add('hidden');
            elements.registerBtn.disabled = true;
        }
    }
}

function handleDetailsSubmit(e) {
    e.preventDefault();
    goToStep(3);
}

// Registration
async function handleRegister() {
    if (!isWalletConnected()) {
        showToast('Please connect your wallet first', 'error');
        return;
    }

    const title = elements.ipTitle.value;
    const description = elements.ipDescription.value;

    // Show pending state
    elements.txStatus.classList.remove('hidden');
    elements.txPending.classList.remove('hidden');
    elements.txSuccess.classList.add('hidden');
    elements.txError.classList.add('hidden');

    // Hide register form
    document.querySelector('.step-content[data-step="3"]').classList.add('hidden');

    try {
        const result = await registerOnBlockchain(currentHash, title, description);

        lastTxData = {
            hash: currentHash,
            title: title,
            owner: getWalletAddress(),
            txHash: result.transactionHash,
            blockNumber: result.blockNumber,
            timestamp: new Date()
        };

        // Show success
        elements.txPending.classList.add('hidden');
        elements.txSuccess.classList.remove('hidden');
        elements.txHash.textContent = result.transactionHash;
        elements.txHash.href = `#`;
        elements.txBlock.textContent = result.blockNumber;

        showToast('IP registered successfully!', 'success');
        loadStats();
        loadMyRecords();

    } catch (error) {
        console.error('Registration error:', error);
        elements.txPending.classList.add('hidden');
        elements.txError.classList.remove('hidden');

        // Friendly error messages
        let msg = error.message || 'Transaction failed';
        if (msg.includes('Contract not deployed')) {
            msg = 'Smart Contract not detected. Please contact support or redeploy.';
        } else if (msg.includes('Blockchain service not connected')) {
            msg = 'Blockchain network unavailable. Please try again later.';
        } else if (msg.includes('user rejected')) {
            msg = 'You rejected the transaction.';
        }

        elements.txErrorMsg.textContent = msg;
    }
}

function resetRegistration() {
    currentFile = null;
    currentHash = null;
    isHashRegistered = false;
    currentStep = 1;

    elements.fileInput.value = '';
    elements.ipTitle.value = '';
    elements.ipDescription.value = '';

    elements.uploadZone.classList.remove('hidden');
    elements.filePreview.classList.add('hidden');
    elements.txStatus.classList.add('hidden');

    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index === 0) el.classList.add('active');
    });

    document.querySelectorAll('.step-content').forEach((el, index) => {
        el.classList.remove('active');
        if (index === 0) el.classList.add('active');
    });

    document.querySelector('.step-content[data-step="3"]').classList.remove('hidden');
}

// Verification
function switchVerifyTab(tab) {
    elements.verifyTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    elements.verifyTabContents.forEach(c => {
        c.classList.toggle('active', c.dataset.tab === tab);
    });
    elements.verifyResult.classList.add('hidden');
}

function handleVerifyDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file) verifyFile(file);
}

function handleVerifyFileSelect(e) {
    const file = e.target.files[0];
    if (file) verifyFile(file);
}

async function verifyFile(file) {
    try {
        const hash = await hashFile(file);
        verifyHashAndShowResult(hash);
    } catch (error) {
        showToast('Error processing file', 'error');
    }
}

function handleVerifyByHash() {
    const hash = elements.verifyHash.value.trim();
    if (!hash || hash.length !== 64) {
        showToast('Please enter a valid 64-character hash', 'error');
        return;
    }
    verifyHashAndShowResult(hash);
}

async function verifyHashAndShowResult(hash) {
    try {
        const result = await checkHashOnChain(hash);

        elements.verifyResult.classList.remove('hidden');

        if (result.registered) {
            elements.resultFound.classList.remove('hidden');
            elements.resultNotFound.classList.add('hidden');

            elements.resultOwner.textContent = result.owner;
            elements.resultTitle.textContent = result.title || 'Untitled';
            elements.resultDate.textContent = formatDate(result.timestamp);
            elements.resultDescription.textContent = result.description || 'No description';
            elements.resultHash.textContent = hash;
        } else {
            elements.resultFound.classList.add('hidden');
            elements.resultNotFound.classList.remove('hidden');
        }
    } catch (error) {
        showToast('Verification failed: ' + error.message, 'error');
    }
}

// Stats
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        if (response.ok) {
            const data = await response.json();
            animateNumber(elements.totalRegistrations, data.totalRegistrations);
        }
    } catch (error) {
        console.log('Stats not available');
    }
}

function animateNumber(element, target) {
    const duration = 1000;
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (target - start) * easeOutCubic(progress));
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// My Records
async function loadMyRecords() {
    if (!isWalletConnected()) return;

    const address = getWalletAddress();
    elements.recordsLoading.classList.remove('hidden');
    elements.recordsGrid.innerHTML = '';

    try {
        const response = await fetch(`/api/records/${address}`);
        if (response.ok) {
            const data = await response.json();

            elements.recordsLoading.classList.add('hidden');

            if (data.records.length === 0) {
                elements.recordsGrid.innerHTML = `
          <div class="records-empty-message" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            <p>No IP registrations found for this wallet.</p>
            <a href="#register" class="btn btn-primary" style="margin-top: 1rem;">Register Your First IP</a>
          </div>
        `;
            } else {
                data.records.forEach(record => {
                    elements.recordsGrid.innerHTML += `
            <div class="record-card">
              <div class="record-header">
                <span class="record-title">${record.title || 'Untitled'}</span>
                <span class="record-date">${formatDate(record.timestamp)}</span>
              </div>
              <code class="record-hash">${record.hash}</code>
            </div>
          `;
                });
            }
        }
    } catch (error) {
        elements.recordsLoading.classList.add('hidden');
        console.log('Could not load records');
    }
}

// Certificate
function showCertificate() {
    if (!lastTxData) return;

    elements.certTitle.textContent = lastTxData.title;
    elements.certOwner.textContent = lastTxData.owner;
    elements.certDate.textContent = formatDate(lastTxData.timestamp.getTime() / 1000);
    elements.certHash.textContent = lastTxData.hash;
    elements.certTxHash.textContent = lastTxData.txHash;

    elements.certificateModal.classList.remove('hidden');
}

function hideCertificate() {
    elements.certificateModal.classList.add('hidden');
}

async function downloadCertificateAsPNG() {
    showToast('Certificate download feature - Coming soon!', 'success');
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success'
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
        }
    </svg>
    <span class="toast-message">${message}</span>
  `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utilities
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

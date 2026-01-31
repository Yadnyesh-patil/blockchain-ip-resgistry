/**
 * Hash Service - Generates SHA-256 hashes in the browser
 * Uses the Web Crypto API for secure hashing
 */

/**
 * Generate SHA-256 hash from a File object
 * @param {File} file - The file to hash
 * @returns {Promise<string>} - Hex-encoded SHA-256 hash
 */
export async function hashFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                resolve(hashHex);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * Generate SHA-256 hash from a string
 * @param {string} data - The string to hash
 * @returns {Promise<string>} - Hex-encoded SHA-256 hash
 */
export async function hashString(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Generate SHA-256 hash from an ArrayBuffer
 * @param {ArrayBuffer} buffer - The buffer to hash
 * @returns {Promise<string>} - Hex-encoded SHA-256 hash
 */
export async function hashBuffer(buffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Verify if a file matches a given hash
 * @param {File} file - The file to verify
 * @param {string} expectedHash - The expected hash
 * @returns {Promise<boolean>} - True if hashes match
 */
export async function verifyFileHash(file, expectedHash) {
    const actualHash = await hashFile(file);
    return actualHash.toLowerCase() === expectedHash.toLowerCase();
}

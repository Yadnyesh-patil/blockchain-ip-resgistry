const crypto = require('crypto');
const fs = require('fs');

/**
 * Hash Service - Generates SHA-256 hashes for files and data
 */
class HashService {

    /**
     * Generate SHA-256 hash from a file buffer
     * @param {Buffer} fileBuffer - The file content as a buffer
     * @returns {string} - Hex-encoded SHA-256 hash
     */
    static hashBuffer(fileBuffer) {
        const hash = crypto.createHash('sha256');
        hash.update(fileBuffer);
        return hash.digest('hex');
    }

    /**
     * Generate SHA-256 hash from a file path
     * @param {string} filePath - Path to the file
     * @returns {Promise<string>} - Hex-encoded SHA-256 hash
     */
    static async hashFile(filePath) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);

            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (error) => reject(error));
        });
    }

    /**
     * Generate SHA-256 hash from a string
     * @param {string} data - The string to hash
     * @returns {string} - Hex-encoded SHA-256 hash
     */
    static hashString(data) {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    }

    /**
     * Verify if a file matches a given hash
     * @param {Buffer} fileBuffer - The file content as a buffer
     * @param {string} expectedHash - The expected hash to compare
     * @returns {boolean} - True if hashes match
     */
    static verifyHash(fileBuffer, expectedHash) {
        const actualHash = this.hashBuffer(fileBuffer);
        return actualHash === expectedHash.toLowerCase();
    }
}

module.exports = HashService;

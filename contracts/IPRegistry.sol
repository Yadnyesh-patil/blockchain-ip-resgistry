// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IPRegistry
 * @dev A smart contract for registering and verifying intellectual property ownership
 * @notice This contract stores cryptographic hashes of files with ownership and timestamp information
 */
contract IPRegistry {
    
    // Structure to store IP record details
    struct IPRecord {
        address owner;          // Wallet address of the IP owner
        string fileHash;        // SHA-256 hash of the file
        uint256 timestamp;      // Block timestamp when registered
        string title;           // Title of the intellectual property
        string description;     // Description of the work
        bool exists;            // Flag to check if record exists
    }
    
    // Mapping from file hash to IP record
    mapping(string => IPRecord) private ipRecords;
    
    // Mapping from owner address to list of their file hashes
    mapping(address => string[]) private ownerRecords;
    
    // Total number of registered IPs
    uint256 public totalRegistrations;
    
    // Events
    event IPRegistered(
        address indexed owner,
        string fileHash,
        string title,
        uint256 timestamp
    );
    
    event OwnershipVerified(
        string fileHash,
        address owner,
        uint256 timestamp
    );
    
    /**
     * @dev Register a new intellectual property
     * @param _fileHash The SHA-256 hash of the file
     * @param _title The title of the intellectual property
     * @param _description A brief description of the work
     */
    function registerIP(
        string memory _fileHash,
        string memory _title,
        string memory _description
    ) external {
        // Check that the hash is not empty
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        
        // Check that this hash hasn't been registered before
        require(!ipRecords[_fileHash].exists, "This file hash is already registered");
        
        // Create the new IP record
        IPRecord memory newRecord = IPRecord({
            owner: msg.sender,
            fileHash: _fileHash,
            timestamp: block.timestamp,
            title: _title,
            description: _description,
            exists: true
        });
        
        // Store the record
        ipRecords[_fileHash] = newRecord;
        
        // Add to owner's list of records
        ownerRecords[msg.sender].push(_fileHash);
        
        // Increment total registrations
        totalRegistrations++;
        
        // Emit event
        emit IPRegistered(msg.sender, _fileHash, _title, block.timestamp);
    }
    
    /**
     * @dev Check if a file hash is already registered
     * @param _fileHash The SHA-256 hash to check
     * @return bool True if registered, false otherwise
     */
    function isRegistered(string memory _fileHash) external view returns (bool) {
        return ipRecords[_fileHash].exists;
    }
    
    /**
     * @dev Verify ownership of a file hash
     * @param _fileHash The SHA-256 hash to verify
     * @return owner The address of the owner
     * @return timestamp The registration timestamp
     * @return exists Whether the record exists
     */
    function verifyOwnership(string memory _fileHash) 
        external 
        view 
        returns (
            address owner,
            uint256 timestamp,
            bool exists
        ) 
    {
        IPRecord memory record = ipRecords[_fileHash];
        return (record.owner, record.timestamp, record.exists);
    }
    
    /**
     * @dev Get full details of an IP record
     * @param _fileHash The SHA-256 hash to look up
     * @return owner The address of the owner
     * @return title The title of the IP
     * @return description The description of the IP
     * @return timestamp The registration timestamp
     * @return exists Whether the record exists
     */
    function getIPDetails(string memory _fileHash)
        external
        view
        returns (
            address owner,
            string memory title,
            string memory description,
            uint256 timestamp,
            bool exists
        )
    {
        IPRecord memory record = ipRecords[_fileHash];
        return (
            record.owner,
            record.title,
            record.description,
            record.timestamp,
            record.exists
        );
    }
    
    /**
     * @dev Get all file hashes registered by an address
     * @param _owner The address to look up
     * @return string[] Array of file hashes
     */
    function getRecordsByOwner(address _owner) 
        external 
        view 
        returns (string[] memory) 
    {
        return ownerRecords[_owner];
    }
    
    /**
     * @dev Get the count of records for an owner
     * @param _owner The address to look up
     * @return uint256 Number of records
     */
    function getRecordCount(address _owner) external view returns (uint256) {
        return ownerRecords[_owner].length;
    }
}

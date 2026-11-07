// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DeploymentCertificateRegistry
 * @dev Public registry for smart contract deployments on Botchain Testnet (Chain ID 968).
 * Generates publicly verifiable deployment certificates and portfolios for Web3 developers.
 * Tagline: Deploy It. Register It. Prove It.
 */
contract DeploymentCertificateRegistry {
    struct Certificate {
        uint256 id;
        string projectName;
        string contractName;
        address contractAddress;
        address deployer;
        string deploymentTxHash;
        uint256 chainId;
        uint256 timestamp;
        string version;
        bytes32 metadataFingerprint;
        bool isBytecodeVerified;
    }

    uint256 private _certificateCounter;
    
    // certificateId => Certificate
    mapping(uint256 => Certificate) public certificates;
    
    // deployer address => list of certificate IDs
    mapping(address => uint256[]) private _deployerCertificates;
    
    // contract address => list of certificate IDs
    mapping(address => uint256[]) private _contractCertificates;

    // Events
    event DeploymentRegistered(
        uint256 indexed certificateId,
        address indexed contractAddress,
        address indexed deployer,
        string projectName,
        string contractName,
        uint256 chainId,
        uint256 timestamp,
        bytes32 metadataFingerprint
    );

    constructor() {
        _certificateCounter = 1000; // Certificates start at 1001 (e.g., DP-001001)
    }

    /**
     * @notice Register a new smart contract deployment record.
     */
    function registerDeployment(
        string calldata projectName,
        string calldata contractName,
        address contractAddress,
        string calldata deploymentTxHash,
        string calldata version,
        bytes32 metadataFingerprint,
        bool isBytecodeVerified
    ) external returns (uint256) {
        require(bytes(projectName).length > 0, "Project name cannot be empty");
        require(contractAddress != address(0), "Contract address cannot be zero");

        unchecked {
            _certificateCounter++;
        }
        uint256 newCertId = _certificateCounter;

        Certificate storage cert = certificates[newCertId];
        cert.id = newCertId;
        cert.projectName = projectName;
        cert.contractName = contractName;
        cert.contractAddress = contractAddress;
        cert.deployer = msg.sender;
        cert.deploymentTxHash = deploymentTxHash;
        cert.chainId = block.chainid;
        cert.timestamp = block.timestamp;
        cert.version = version;
        cert.metadataFingerprint = metadataFingerprint;
        cert.isBytecodeVerified = isBytecodeVerified;

        _deployerCertificates[msg.sender].push(newCertId);
        _contractCertificates[contractAddress].push(newCertId);

        emit DeploymentRegistered(
            newCertId,
            contractAddress,
            msg.sender,
            projectName,
            contractName,
            block.chainid,
            block.timestamp,
            metadataFingerprint
        );

        return newCertId;
    }

    /**
     * @notice Retrieve certificate details by ID.
     */
    function getCertificate(uint256 certificateId) external view returns (Certificate memory) {
        require(certificates[certificateId].id != 0, "Certificate does not exist");
        return certificates[certificateId];
    }

    /**
     * @notice Retrieve all certificate IDs registered by a specific wallet.
     */
    function getMyDeployments(address deployer) external view returns (uint256[] memory) {
        return _deployerCertificates[deployer];
    }

    /**
     * @notice Retrieve all certificate IDs registered for a given contract address.
     */
    function getContractDeployments(address contractAddr) external view returns (uint256[] memory) {
        return _contractCertificates[contractAddr];
    }

    /**
     * @notice Get the total count of certificates registered.
     */
    function getDeploymentCount() external view returns (uint256) {
        return _certificateCounter - 1000;
    }

    /**
     * @notice Verify a certificate's authenticity against a metadata fingerprint.
     */
    function verifyCertificate(uint256 certificateId, bytes32 metadataFingerprint) external view returns (bool) {
        if (certificates[certificateId].id == 0) return false;
        return certificates[certificateId].metadataFingerprint == metadataFingerprint;
    }

    /**
     * @notice Fetch a batch of recent deployments for feed/dashboard.
     */
    function getRecentDeployments(uint256 limit) external view returns (Certificate[] memory) {
        uint256 total = _certificateCounter - 1000;
        if (total == 0) {
            return new Certificate[](0);
        }

        uint256 count = limit > total ? total : limit;
        Certificate[] memory result = new Certificate[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 certId = _certificateCounter - i;
            result[i] = certificates[certId];
        }

        return result;
    }
}

export interface Certificate {
  id: number;
  formattedId: string; // e.g. "DP-001001"
  projectName: string;
  contractName: string;
  contractAddress: string;
  deployer: string;
  deploymentTxHash: string;
  chainId: number;
  timestamp: number;
  version: string;
  metadataFingerprint: string;
  isBytecodeVerified: boolean;
  compiler?: string;
  license?: string;
  description?: string;
  repositoryUrl?: string;
  registrationTxHash?: string;
}

export interface CertificateMetadata {
  projectName: string;
  contractName: string;
  contractAddress: string;
  deployer: string;
  deploymentTxHash: string;
  chainId: number;
  version: string;
  compiler?: string;
  license?: string;
  description?: string;
  repositoryUrl?: string;
  timestamp: number;
}

export interface VerificationResult {
  isValid: boolean;
  hasBytecode: boolean;
  txFound: boolean;
  deployerMatch: boolean;
  details: {
    contractAddress: string;
    deployer?: string;
    blockNumber?: number;
    transactionHash?: string;
    gasUsed?: string;
  };
  error?: string;
}


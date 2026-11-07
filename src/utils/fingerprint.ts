import { keccak256, toHex, stringToBytes } from 'viem';
import { CertificateMetadata } from '../types/certificate';

/**
 * Computes a deterministic keccak256 fingerprint from deployment metadata.
 * Ensures the on-chain certificate can be verified against the full off-chain record.
 */
export function computeMetadataFingerprint(metadata: Partial<CertificateMetadata>): `0x${string}` {
  const canonicalString = JSON.stringify({
    projectName: (metadata.projectName || '').trim(),
    contractName: (metadata.contractName || '').trim(),
    contractAddress: (metadata.contractAddress || '').toLowerCase().trim(),
    deployer: (metadata.deployer || '').toLowerCase().trim(),
    deploymentTxHash: (metadata.deploymentTxHash || '').toLowerCase().trim(),
    chainId: metadata.chainId || 968,
    version: (metadata.version || 'v1.0.0').trim(),
  });

  return keccak256(stringToBytes(canonicalString));
}

/**
 * Formats certificate ID into standard DeployProof identifier (e.g. DP-001001)
 */
export function formatCertificateId(id: number | string): string {
  const num = typeof id === 'string' ? parseInt(id, 10) : id;
  return `DP-${String(num).padStart(6, '0')}`;
}


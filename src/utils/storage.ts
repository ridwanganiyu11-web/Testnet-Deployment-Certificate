import { Certificate } from '../types/certificate';
import { formatCertificateId } from './fingerprint';

const STORAGE_KEY = 'deployproof_certificates_v1';

export const INITIAL_DEMO_CERTIFICATES: Certificate[] = [
  {
    id: 1001,
    formattedId: 'DP-001001',
    projectName: 'BotPay',
    contractName: 'BotPay.sol',
    contractAddress: '0x3edc1a780a555e290fbed724bc2ee4b31d9b8dd1',
    deployer: '0x5E889b72A1464489e7df124280Ee4A5c11b039B3',
    deploymentTxHash: '0x75d71bafc66dc8924e5c01848fca9fc1d356ec38a9f432717acb2e02e371af1c',
    chainId: 968,
    timestamp: 1731000000,
    version: 'v1.0.0',
    metadataFingerprint: '0x9a3bc7ef88219460d37542da65c568f184e51be213bfa73e16bbca9d6f51e331',
    isBytecodeVerified: true,
    compiler: 'Solidity 0.8.20',
    license: 'MIT',
    description: 'Decentralized payment and checkout infrastructure on Botchain Testnet (Chain ID 968).',
    repositoryUrl: 'https://github.com/botpay-org/core-contracts',
    registrationTxHash: '0xe978459d6087aa1273de3c47e6726a43f67eb45bfbe45b570e32d7c72ded5831',
  },
  {
    id: 1002,
    formattedId: 'DP-001002',
    projectName: 'BotCard',
    contractName: 'BotCard.sol',
    contractAddress: '0x81b7e08F65Bdf93a7b73cc157A22441c9B0C0412',
    deployer: '0x5b38Da6a701c568545dCfcB03FcB875f56beddC4',
    deploymentTxHash: '0x9c412e4d081f9643440ea31ef824a7372b834920fc9588bf6384a51e60f0471b',
    chainId: 968,
    timestamp: 1730500000,
    version: 'v1.2.0',
    metadataFingerprint: '0xd7542da65c568f184e51be213bfa73e16bbca9d6f51e3319a3bc7ef88219460',
    isBytecodeVerified: true,
    compiler: 'Solidity 0.8.24',
    license: 'Apache-2.0',
    description: 'Dynamic NFT identity cards with soulbound attestation credentials.',
    repositoryUrl: 'https://github.com/botcard/botcard-protocol',
    registrationTxHash: '0x629810d7ef320aa112f483c65961d15db4a74284d7fb8fbc9108f2d5a1bc36ef',
  },
  {
    id: 1003,
    formattedId: 'DP-001003',
    projectName: 'BohrDex Router',
    contractName: 'BohrSwapRouter.sol',
    contractAddress: '0x22C6F35B91aE3A8211E39230571C3545b736b76e',
    deployer: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    deploymentTxHash: '0x320aa112f483c65961d15db4a74284d7fb8fbc9108f2d5a1bc36ef629810d7ef',
    chainId: 968,
    timestamp: 1731000000,
    version: 'v2.1.0',
    metadataFingerprint: '0x184e51be213bfa73e16bbca9d6f51e3319a3bc7ef88219460d7542da65c568f',
    isBytecodeVerified: true,
    compiler: 'Solidity 0.8.20',
    license: 'GPL-3.0',
    description: 'Automated liquidity market maker and token swap router for BOT pairs.',
    repositoryUrl: 'https://github.com/bohrdex/router-v2',
  },
];

export function loadStoredCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CERTIFICATES));
      return INITIAL_DEMO_CERTIFICATES;
    }
    const parsed: Certificate[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : INITIAL_DEMO_CERTIFICATES;
  } catch (e) {
    return INITIAL_DEMO_CERTIFICATES;
  }
}

export function saveCertificate(cert: Certificate): void {
  const current = loadStoredCertificates();
  // Check if exists
  const existsIndex = current.findIndex((c) => c.id === cert.id || c.formattedId === cert.formattedId);
  if (existsIndex >= 0) {
    current[existsIndex] = cert;
  } else {
    current.unshift(cert);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save certificate to local storage', e);
  }
}

export function getCertificateById(id: number | string): Certificate | undefined {
  const certs = loadStoredCertificates();
  const numericId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) : id;
  const formatted = formatCertificateId(numericId);
  return certs.find((c) => c.id === numericId || c.formattedId === formatted);
}


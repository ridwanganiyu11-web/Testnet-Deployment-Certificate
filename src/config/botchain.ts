import { defineChain } from 'viem';

export const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Botchain Token',
    symbol: 'BOT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
    public: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BohrScan',
      url: 'https://scan.bohr.life',
    },
  },
  testnet: true,
});

export const BOTCHAIN_CONFIG = {
  chainId: 968,
  name: 'Botchain Testnet',
  rpcUrl: 'https://rpc.bohr.life',
  nativeToken: 'BOT',
  totalSupply: '150,000,000 BOT',
  explorerUrl: 'https://scan.bohr.life',
  // Live Deployed Registry contract on Botchain Testnet (Chain ID 968)
  defaultRegistryAddress: ((import.meta as any).env?.VITE_REGISTRY_CONTRACT_ADDRESS || '0x4ae0a065684515e34dc1bbb0028572a48a42bb04') as `0x${string}`,
};


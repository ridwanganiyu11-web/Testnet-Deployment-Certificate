import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { botchainTestnet } from './botchain';

// 1. Get projectId from environment or use a fallback public AppKit demo project ID
// Users can configure VITE_REOWN_PROJECT_ID in .env
export const projectId = (import.meta as any).env?.VITE_REOWN_PROJECT_ID || 'b8a07c13936cb077e68bc65471d47348';

export const networks = [botchainTestnet];

// 2. Set up Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

// 3. Metadata for AppKit modal
export const metadata = {
  name: 'DeployProof',
  description: 'Deploy It. Register It. Prove It. Public smart contract deployment certificates on Botchain Testnet.',
  url: 'https://deployproof.app',
  icons: ['https://scan.bohr.life/favicon.ico'],
};

// 4. Initialize AppKit
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [botchainTestnet],
  defaultNetwork: botchainTestnet,
  metadata,
  projectId,
  features: {
    analytics: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#10b981',
    '--w3m-border-radius-master': '8px',
  },
});


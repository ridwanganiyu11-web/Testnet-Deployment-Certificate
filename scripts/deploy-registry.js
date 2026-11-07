import { createWalletClient, createPublicClient, http, formatEther, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const botchainTestnet = defineChain({
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

async function main() {
  console.log("=================================================");
  console.log("🚀 Deploying DeploymentCertificateRegistry.sol");
  console.log("🌐 Network: Botchain Testnet (Chain ID 968)");
  console.log("=================================================\n");

  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) {
    throw new Error("PRIVATE_KEY not found in .env");
  }

  const formattedPk = pk.startsWith('0x') ? pk : `0x${pk}`;
  const account = privateKeyToAccount(formattedPk);
  console.log("Deployer Address:", account.address);

  const publicClient = createPublicClient({
    chain: botchainTestnet,
    transport: http('https://rpc.bohr.life'),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Account Balance:", formatEther(balance), "BOT\n");

  if (balance === 0n) {
    throw new Error("Deployer account has 0 BOT. Please fund testnet BOT tokens first.");
  }

  // Load contract artifact
  const artifactPath = path.resolve('./artifacts/contracts/DeploymentCertificateRegistry.sol/DeploymentCertificateRegistry.json');
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Please run 'npx hardhat --config hardhat.config.cjs compile' first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const walletClient = createWalletClient({
    account,
    chain: botchainTestnet,
    transport: http('https://rpc.bohr.life'),
  });

  console.log("Broadcasting deployment transaction to Botchain Testnet...");
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
  });

  console.log("Tx Hash:", hash);
  console.log("Waiting for block confirmation on BohrScan...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== 'success') {
    throw new Error("Transaction reverted on-chain!");
  }

  const contractAddress = receipt.contractAddress;
  console.log("\n=================================================");
  console.log("🎉 CONTRACT DEPLOYED SUCCESSFULLY!");
  console.log("Contract Address:", contractAddress);
  console.log("Block Number:", receipt.blockNumber.toString());
  console.log("Gas Used:", receipt.gasUsed.toString());
  console.log("BohrScan Link:", `https://scan.bohr.life/address/${contractAddress}`);
  console.log("Tx Explorer:", `https://scan.bohr.life/tx/${hash}`);
  console.log("=================================================\n");

  // Automatically update .env with deployed address
  try {
    const envPath = path.resolve('.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('VITE_REGISTRY_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /VITE_REGISTRY_CONTRACT_ADDRESS=.*/,
        `VITE_REGISTRY_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nVITE_REGISTRY_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log("✅ Updated .env with VITE_REGISTRY_CONTRACT_ADDRESS=" + contractAddress);
  } catch (err) {
    console.warn("Could not auto-update .env:", err.message);
  }
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exitCode = 1;
});

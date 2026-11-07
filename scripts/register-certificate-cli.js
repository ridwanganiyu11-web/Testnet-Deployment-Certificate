import { createWalletClient, createPublicClient, http, formatEther, defineChain, keccak256, stringToBytes } from 'viem';
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

// Simple args parser
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    project: 'BotPay',
    contract: 'BotPay.sol',
    address: '0x3edc1a780a555e290fbed724bc2ee4b31d9b8dd1',
    tx: '0x75d71bafc66dc8924e5c01848fca9fc1d356ec38a9f432717acb2e02e371af1c',
    version: 'v1.0.0',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--project' && args[i + 1]) params.project = args[++i];
    if (args[i] === '--contract' && args[i + 1]) params.contract = args[++i];
    if (args[i] === '--address' && args[i + 1]) params.address = args[++i];
    if (args[i] === '--tx' && args[i + 1]) params.tx = args[++i];
    if (args[i] === '--version' && args[i + 1]) params.version = args[++i];
  }
  return params;
}

async function main() {
  const params = parseArgs();
  console.log("=================================================");
  console.log("🛡️  DeployProof On-Chain Registration CLI");
  console.log("🌐 Network: Botchain Testnet (Chain ID 968)");
  console.log("=================================================\n");
  console.log(`Project:  ${params.project}`);
  console.log(`Contract: ${params.contract}`);
  console.log(`Address:  ${params.address}`);
  console.log(`Tx Hash:  ${params.tx}`);
  console.log(`Version:  ${params.version}\n`);

  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) {
    throw new Error("PRIVATE_KEY not found in .env");
  }

  const formattedPk = pk.startsWith('0x') ? pk : `0x${pk}`;
  const account = privateKeyToAccount(formattedPk);
  console.log("Registrar Wallet:", account.address);

  const publicClient = createPublicClient({
    chain: botchainTestnet,
    transport: http('https://rpc.bohr.life'),
  });

  const registryAddress = process.env.VITE_REGISTRY_CONTRACT_ADDRESS || '0x4ae0a065684515e34dc1bbb0028572a48a42bb04';
  console.log("Registry Contract:", registryAddress);

  // Check bytecode on Botchain Testnet (Option C)
  console.log("Inspecting bytecode at contract address...");
  const code = await publicClient.getBytecode({ address: params.address });
  const isBytecodeVerified = !!code && code !== '0x' && code.length > 2;
  console.log("Bytecode Verified:", isBytecodeVerified ? "✅ YES" : "⚠️ NO (Self-reported)");

  // Compute metadata fingerprint
  const canonicalString = JSON.stringify({
    projectName: params.project.trim(),
    contractName: params.contract.trim(),
    contractAddress: params.address.toLowerCase().trim(),
    deployer: account.address.toLowerCase().trim(),
    deploymentTxHash: params.tx.toLowerCase().trim(),
    chainId: 968,
    version: params.version.trim(),
  });
  const metadataFingerprint = keccak256(stringToBytes(canonicalString));
  console.log("Metadata Fingerprint (keccak256):", metadataFingerprint);

  // Load Registry ABI
  const artifactPath = path.resolve('./artifacts/contracts/DeploymentCertificateRegistry.sol/DeploymentCertificateRegistry.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const walletClient = createWalletClient({
    account,
    chain: botchainTestnet,
    transport: http('https://rpc.bohr.life'),
  });

  console.log("\nSubmitting registration transaction to Botchain Testnet...");
  const txHash = await walletClient.writeContract({
    address: registryAddress,
    abi: artifact.abi,
    functionName: 'registerDeployment',
    args: [
      params.project,
      params.contract,
      params.address,
      params.tx,
      params.version,
      metadataFingerprint,
      isBytecodeVerified,
    ],
  });

  console.log("Registration Tx:", txHash);
  console.log("Waiting for block confirmation on BohrScan...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  if (receipt.status !== 'success') {
    throw new Error("Transaction reverted!");
  }

  // Get total count / latest certificate
  const certCount = await publicClient.readContract({
    address: registryAddress,
    abi: artifact.abi,
    functionName: 'getDeploymentCount',
  });

  const latestCertId = 1000n + certCount;
  const formattedId = `DP-${String(latestCertId).padStart(6, '0')}`;

  console.log("\n=================================================");
  console.log("🎉 CERTIFICATE REGISTERED ON-CHAIN!");
  console.log(`Certificate ID:     ${formattedId}`);
  console.log(`Registration Block: ${receipt.blockNumber.toString()}`);
  console.log(`Registration Tx:    https://scan.bohr.life/tx/${txHash}`);
  console.log(`Public Proof URL:   http://localhost:3000/?tab=certificate&id=${formattedId}`);
  console.log("=================================================\n");
}

main().catch((err) => {
  console.error("❌ Registration failed:", err);
  process.exitCode = 1;
});

import { createPublicClient, http, isAddress, Hash, Address } from 'viem';
import { botchainTestnet } from '../config/botchain';
import { VerificationResult } from '../types/certificate';

const client = createPublicClient({
  chain: botchainTestnet,
  transport: http(),
});

/**
 * Checks if a contract address has deployed bytecode on Botchain Testnet.
 */
export async function checkBytecodeOnBotchain(address: string): Promise<boolean> {
  if (!isAddress(address)) return false;
  try {
    const code = await client.getBytecode({ address: address as Address });
    return !!code && code !== '0x' && code.length > 2;
  } catch (error) {
    console.warn('Failed to query bytecode on Botchain RPC:', error);
    return false;
  }
}

/**
 * Automatically inspects Botchain Testnet for deployment transaction and contract bytecode.
 * Used for Option C: Automatic on-chain verification with manual fallback.
 */
export async function verifyDeploymentOnChain(
  contractAddress: string,
  txHash?: string
): Promise<VerificationResult> {
  const result: VerificationResult = {
    isValid: false,
    hasBytecode: false,
    txFound: false,
    deployerMatch: false,
    details: {
      contractAddress,
    },
  };

  try {
    if (contractAddress && isAddress(contractAddress)) {
      result.hasBytecode = await checkBytecodeOnBotchain(contractAddress);
    }

    if (txHash && txHash.startsWith('0x') && txHash.length === 66) {
      try {
        const receipt = await client.getTransactionReceipt({ hash: txHash as Hash });
        if (receipt) {
          result.txFound = true;
          result.details.deployer = receipt.from;
          result.details.blockNumber = Number(receipt.blockNumber);
          result.details.transactionHash = txHash;
          result.details.gasUsed = receipt.gasUsed.toString();

          if (receipt.contractAddress) {
            result.details.contractAddress = receipt.contractAddress;
          }
        }
      } catch (txErr) {
        console.warn('Transaction receipt not yet indexed or found:', txErr);
      }
    }

    // Deemed valid if either bytecode exists or a valid deployment receipt was found
    result.isValid = result.hasBytecode || result.txFound;
  } catch (err: any) {
    result.error = err.message || 'RPC verification failed';
  }

  return result;
}


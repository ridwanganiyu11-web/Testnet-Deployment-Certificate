import { createPublicClient, http, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) {
    console.log("No PRIVATE_KEY found in .env");
    return;
  }

  const formattedPk = pk.startsWith('0x') ? pk : `0x${pk}`;
  
  try {
    const account = privateKeyToAccount(formattedPk);
    console.log("Deployer Address:", account.address);

    const client = createPublicClient({
      transport: http('https://rpc.bohr.life'),
    });

    const balance = await client.getBalance({ address: account.address });
    console.log("Botchain Testnet Balance:", formatEther(balance), "BOT");
    console.log("Ready to deploy!");
  } catch (err) {
    console.error("Error checking account:", err.message);
  }
}

check();


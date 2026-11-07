import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DeploymentCertificateRegistry to Botchain Testnet (Chain ID 968)...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BOT");

  const Registry = await ethers.getContractFactory("DeploymentCertificateRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("DeploymentCertificateRegistry deployed successfully!");
  console.log("Contract Address:", registryAddress);
  console.log("Block Explorer:", `https://scan.bohr.life/address/${registryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


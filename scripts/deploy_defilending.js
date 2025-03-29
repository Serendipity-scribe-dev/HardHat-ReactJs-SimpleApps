const hre = require("hardhat");

async function main() {
  // Replace with the actual ERC-20 token address
  const tokenAddress = "0x49aaF5b90776bBF3Ab7372B6D4bB24d5AfAD088d";

  console.log("Deploying DeFiLending contract...");

  // Get the Contract Factory
  const DeFiLending = await hre.ethers.getContractFactory("DeFiLending");

  // Deploy the contract
  const defiLending = await DeFiLending.deploy(tokenAddress);

  await defiLending.waitForDeployment();

  console.log("DeFiLending deployed to:", await defiLending.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers } = require("hardhat");
const dotenv = require("dotenv");

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Example: Alchemy, Infura, or local node
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenAddress = "0x49aaF5b90776bBF3Ab7372B6D4bB24d5AfAD088d"; // Replace with ERC-20 contract address
const recipient = "0x59d4a85Bd9915F9fA29E79BD5163f4722D122ACd"; // Replace with DeFiLending contract address
const amount = ethers.parseUnits("1000", 18); // Sending 1000 tokens (18 decimals)

const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function transfer(address to, uint256 amount) public returns (bool)"],
    wallet
);

async function sendTokens() {
    console.log("Sending tokens...");
    const tx = await tokenContract.transfer(recipient, amount);
    await tx.wait();
    console.log(`✅ Sent 1000 tokens to ${recipient}`);
}

sendTokens().catch(console.error);

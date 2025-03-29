const { ethers } = require("hardhat");

async function main() {
    // **1️⃣ Get the Signer (Deployer)**
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with the account:", deployer.address);

    // **2️⃣ Deploy the ERC-20 Token**
    const Token = await ethers.getContractFactory("MyToken");
    const initialSupply = ethers.parseUnits("1000000", 18);  // 1 Million Tokens (with 18 decimals)
    const token = await Token.deploy(initialSupply);

    await token.waitForDeployment();
    console.log("ERC-20 Token deployed at:", await token.getAddress());
}

// **Handle Errors**
main().catch((error) => {
    console.error(error);
    process.exit(1);
});


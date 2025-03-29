const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const MyContract = await hre.ethers.getContractFactory("Mycontract");

    // Deploy the contract
    const myContract = await MyContract.deploy("Hello, Blockchain!");

    // Wait for deployment to finish
    await myContract.waitForDeployment();

    console.log("Contract deployed to:",myContract.address || await myContract.getAddress());
}
    main ().catch((error)=>{
        console.error(error);
        process.exitCode =1;
    });

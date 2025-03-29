const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const TodoList = await hre.ethers.getContractFactory("TodoList");

    // Deploy the contract
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();

    // Get the deployed contract address
    console.log("TodoList Contract deployed to:", await todoList.getAddress());
}

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

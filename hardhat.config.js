require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    localhost:{
      url:"http://localhost:8545",
      
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/IB_61s5Y78QPPa-uwZeQoUQ-m4y6Vtjw",
      accounts: ["81fd51339437839077487ea4bec64d34ace8aa802b9bfa1831480e2ac67029c7",] // Replace with your private key
    }
  }
};

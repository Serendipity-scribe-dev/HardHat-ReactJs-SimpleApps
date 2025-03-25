const hre = require ("hardhat")
async function main(){
    const candidates = ["Kriti", "Nandisa", "Prajna"];
    const Voting = await hre.ethers.getContractFactory("voting");
    const Vote = await Voting.deploy(candidates);
    await Vote.waitForDeployment();
    console.log("Contract deployed to:",Vote.address || await Vote.getAddress());}
    main ().catch((error)=>{
        console.error(error);
        process.exitCode =1;
    });
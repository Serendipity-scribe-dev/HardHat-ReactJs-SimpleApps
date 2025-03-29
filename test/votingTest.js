const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("votingTest", function () {
  let VotingTest,Votingtest;
  beforeEach(async function () {
    const candidates = ["Kriti", "Nandisa", "Prajna"];
    const VotingTest = await ethers.getContractFactory("voting");
    Votingtest = await VotingTest.deploy(candidates);
    await Votingtest.waitForDeployment();
  });
  it("should vote", async function () {
    await Votingtest.vote(0);
  });
  it("should getwinner", async function () {
    await Votingtest.getWinner();
  });
});
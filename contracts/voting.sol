// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract voting{
    struct candidate{
        string name;
        uint count;
    }
    address public admin;
    mapping(address => bool) public hasVoted;
    candidate[] public candidates;
    constructor(string[]memory _candidateNames){
        admin = msg.sender;
         for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(candidate(_candidateNames[i], 0));
        }
    }
     function vote(uint _candidateIndex) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate index");
        hasVoted[msg.sender] = true;
        candidates[_candidateIndex].count++;
        console.log("Voter:", msg.sender, "voted for", candidates[_candidateIndex].name);

    }
     function getWinner() external view returns (string memory) {
        uint j = 0;
        uint k = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].count > j) {
                j = candidates[i].count;
                k = i;
            }
        }
        return candidates[k].name;
    }
}
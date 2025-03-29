// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Mycontract {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }

    function updateMessage(string memory newMessage) public {
        message = newMessage;
    }
}
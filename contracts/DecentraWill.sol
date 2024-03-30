// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DecentraWill {
    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    // Nested mapping remains to store the actual allocations.
    // tokenAllocations[userAddress][tokenAddress][recipientAddress] = amount
    mapping(address => mapping(address => mapping(address => uint256)))
        public tokenAllocations;

    // Arrays to keep track of which tokens each user has allocated and to whom.
    mapping(address => address[]) private userAllocatedTokens;
    mapping(address => mapping(address => address[])) private tokenRecipients;
}

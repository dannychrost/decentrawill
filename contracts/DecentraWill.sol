// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DecentraWill {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

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

    // Helper function to add a token to the user's allocated list if it's not already there.
    function _addTokenForUser(address user, address token) private {
        if (!isTokenAllocatedByUser(user, token)) {
            userAllocatedTokens[user].push(token);
        }
    }

    // Helper function to add a recipient for a token if it's not already there.
    function _addRecipientForToken(
        address user,
        address token,
        address recipient
    ) private {
        if (!isRecipientOfToken(user, token, recipient)) {
            tokenRecipients[user][token].push(recipient);
        }
    }

    // Check if a token is already allocated by a user.
    function isTokenAllocatedByUser(
        address user,
        address token
    ) public view returns (bool) {
        for (uint i = 0; i < userAllocatedTokens[user].length; i++) {
            if (userAllocatedTokens[user][i] == token) {
                return true;
            }
        }
        return false;
    }

    // Check if an address is already a recipient of a specific token by a user.
    function isRecipientOfToken(
        address user,
        address token,
        address recipient
    ) public view returns (bool) {
        for (uint i = 0; i < tokenRecipients[user][token].length; i++) {
            if (tokenRecipients[user][token][i] == recipient) {
                return true;
            }
        }
        return false;
    }

    // Public function to set allocations, with added logic to track tokens and recipients.
    function setAllocation(
        address token,
        address recipient,
        uint256 amount
    ) public {
        tokenAllocations[msg.sender][token][recipient] = amount;
        _addTokenForUser(msg.sender, token);
        _addRecipientForToken(msg.sender, token, recipient);
    }

    // Function to get a list of tokens allocated by a user.
    function getAllocatedTokensByUser(
        address user
    ) public view returns (address[] memory) {
        return userAllocatedTokens[user];
    }

    // Function to get a list of recipients for a specific token allocated by a user.
    function getRecipientsByToken(
        address user,
        address token
    ) public view returns (address[] memory) {
        return tokenRecipients[user][token];
    }

    // Function to remove a specific recipient for a token from a user's allocation
    function removeRecipientForToken(
        address user,
        address token,
        address recipient
    ) public onlyOwner {
        require(
            isRecipientOfToken(user, token, recipient),
            "Recipient not found"
        );
        uint256 index;
        for (index = 0; index < tokenRecipients[user][token].length; index++) {
            if (tokenRecipients[user][token][index] == recipient) {
                break;
            }
        }
        // Remove recipient from the array
        for (
            uint256 i = index;
            i < tokenRecipients[user][token].length - 1;
            i++
        ) {
            tokenRecipients[user][token][i] = tokenRecipients[user][token][
                i + 1
            ];
        }
        tokenRecipients[user][token].pop();

        // Remove the allocation
        delete tokenAllocations[user][token][recipient];
    }

    // Adjust the allocated amount for a recipient or remove it if the amount is zero
    function adjustAllocation(
        address token,
        address recipient,
        uint256 amount
    ) public {
        if (amount == 0) {
            delete tokenAllocations[msg.sender][token][recipient];
            // Consideration: Additional logic to clean up userAllocatedTokens and tokenRecipients if needed
        } else {
            tokenAllocations[msg.sender][token][recipient] = amount;
        }
    }
}

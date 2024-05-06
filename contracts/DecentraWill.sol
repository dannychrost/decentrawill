// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DecentraWill {
    address public owner;
    // Events
    event AllocationSet(
        address indexed user,
        address indexed token,
        address indexed recipient,
        uint256 amount
    );
    event RecipientRemoved(
        address indexed user,
        address indexed token,
        address indexed recipient
    );
    event Withdrawal(
        address indexed creator,
        address indexed token,
        address indexed beneficiary,
        uint256 amount
    );

    // Errors
    error Unauthorized(); // No additional data needed
    error RecipientNotFound(); // When a specific recipient cannot be found
    error NoAllocationAvailable(); // When there is no allocation available for a withdrawal
    error TransferFailed(); // If the ERC20 token transfer fails
    error InvalidDeadline(); // When the new deadline is not in the future
    error DeadlineNotMet(); // When the deadline has not yet been met for withdrawal

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    // Nested mapping remains to store the actual allocations.
    // tokenAllocations[userAddress][tokenAddress][recipientAddress] = amount
    mapping(address => mapping(address => mapping(address => uint256)))
        public tokenAllocations;

    // Mapping from creator to deadline timestamp
    mapping(address => uint256) public creatorDeadlines;

    // Arrays to keep track of which tokens each user has allocated and to whom.
    // Creator => Tokens
    mapping(address => address[]) private userAllocatedTokens;
    // Creator => Token => Recipients
    mapping(address => mapping(address => address[])) private tokenRecipients;

    // Mapping to keep track of the creators that have allocated tokens to a beneficiary.
    // Beneficiary => Creators
    mapping(address => address[]) public creatorsForBeneficiary;

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

    // Helper function to add a creator for a beneficiary if not already there
    function _addCreatorForBeneficiary(
        address creator,
        address beneficiary
    ) private {
        bool creatorExists = false;
        for (uint i = 0; i < creatorsForBeneficiary[beneficiary].length; i++) {
            if (creatorsForBeneficiary[beneficiary][i] == creator) {
                creatorExists = true;
                break;
            }
        }
        if (!creatorExists) {
            creatorsForBeneficiary[beneficiary].push(creator);
        }
    }

    // Public function to set allocations, with added logic to track tokens and recipients.
    function setAllocation(
        address token,
        address recipient,
        uint256 amount
    ) public {
        if (amount == 0) {
            // Attempt to remove the recipient if the allocation amount is zero.
            // This call will also handle removing the user from creators list if no other allocations exist.
            removeRecipientForToken(msg.sender, token, recipient);
        } else {
            // Set or update the allocation amount
            tokenAllocations[msg.sender][token][recipient] = amount;

            // Add token to user's allocated tokens list if not already there
            _addTokenForUser(msg.sender, token);
            // Add recipient to the token's recipient list if not already there
            _addRecipientForToken(msg.sender, token, recipient);
            // Add creator for beneficiary mapping if not already there
            _addCreatorForBeneficiary(msg.sender, recipient);
            emit AllocationSet(msg.sender, token, recipient, amount); // Emit event when allocation is set
        }
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
    ) public {
        if (!isRecipientOfToken(user, token, recipient)) {
            revert RecipientNotFound();
        }

        // Find and remove the recipient from the recipients list
        uint256 index;
        for (index = 0; index < tokenRecipients[user][token].length; index++) {
            if (tokenRecipients[user][token][index] == recipient) {
                break;
            }
        }
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

        // Remove the token allocation for the recipient
        delete tokenAllocations[user][token][recipient];

        // Check if there are no more recipients for this token
        if (tokenRecipients[user][token].length == 0) {
            // Find and remove the token from userAllocatedTokens if no recipients are left
            for (index = 0; index < userAllocatedTokens[user].length; index++) {
                if (userAllocatedTokens[user][index] == token) {
                    for (
                        uint256 i = index;
                        i < userAllocatedTokens[user].length - 1;
                        i++
                    ) {
                        userAllocatedTokens[user][i] = userAllocatedTokens[
                            user
                        ][i + 1];
                    }
                    userAllocatedTokens[user].pop();
                    break;
                }
            }
        }
        // Check if the user has any other tokens allocated to the recipient
        bool hasOtherAllocations = false;
        address[] memory allocatedTokens = userAllocatedTokens[user];
        for (uint i = 0; i < allocatedTokens.length; i++) {
            if (tokenAllocations[user][allocatedTokens[i]][recipient] > 0) {
                hasOtherAllocations = true;
                break;
            }
        }

        // If no other allocations exist, remove the user from the recipient's creators list
        if (!hasOtherAllocations) {
            address[] storage creatorsList = creatorsForBeneficiary[recipient];
            for (uint i = 0; i < creatorsList.length; i++) {
                if (creatorsList[i] == user) {
                    for (uint j = i; j < creatorsList.length - 1; j++) {
                        creatorsList[j] = creatorsList[j + 1];
                    }
                    creatorsList.pop();
                    break;
                }
            }
        }

        emit RecipientRemoved(user, token, recipient); // Emit event when a recipient is removed
    }

    function withdrawTokenForBeneficiary(
        address creator,
        address token,
        uint256 requestedAmount
    ) public {
        if (!isRecipientOfToken(creator, token, msg.sender)) {
            revert RecipientNotFound();
        }

        uint256 allocation = tokenAllocations[creator][token][msg.sender];
        if (allocation == 0) {
            revert NoAllocationAvailable();
        }

        // Ensure a deadline is set and has passed
        uint256 deadline = creatorDeadlines[creator];
        if (deadline == 0 || block.timestamp < deadline) {
            revert DeadlineNotMet();
        }

        uint256 withdrawalAmount = (requestedAmount > allocation)
            ? allocation
            : requestedAmount;

        // Decrease the allocation before transferring to prevent re-entrancy attacks
        tokenAllocations[creator][token][msg.sender] -= withdrawalAmount;

        // Transfer the tokens from the will creator's account to the beneficiary
        bool success = IERC20(token).transferFrom(
            creator,
            msg.sender,
            withdrawalAmount
        );
        if (!success) {
            revert TransferFailed();
        }

        emit Withdrawal(creator, token, msg.sender, withdrawalAmount);

        // Cleanup if all tokens are withdrawn
        if (tokenAllocations[creator][token][msg.sender] == 0) {
            removeRecipientForToken(creator, token, msg.sender);
        }
    }

    function setCreatorDeadline(uint256 newDeadline) public {
        if (newDeadline <= block.timestamp) {
            revert InvalidDeadline();
        }
        creatorDeadlines[msg.sender] = newDeadline;
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(
            address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266), // Deployer address, change to your preferred address
            10000 * 10 ** 18
        ); // Mint 10,000 mUSDC tokens to the deployer
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWETH is ERC20 {
    constructor() ERC20("Mock WETH", "mWETH") {
        _mint(
            address(0xD71603C15CB21B0016EacE3626C8242c1E2eCb7C), // Deployer address, change to your preferred address
            10000 * 10 ** 18
        ); // Mint 10,000 mUSDC tokens to the deployer
    }
}

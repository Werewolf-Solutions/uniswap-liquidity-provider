# Shell commands

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

# TODO

# Problem

This is to understand how solidity versions control works.

- I want to compile successfully 2 contracts like in [example](#example).

- I want to provide liquidity like in this examples

  - contract set up https://docs.uniswap.org/contracts/v3/guides/providing-liquidity/setting-up

  - mint new position https://docs.uniswap.org/contracts/v3/guides/providing-liquidity/mint-a-position

I have created 2 branches for different examples

# Branches

# master

Where I will merge the solutions and the main branch when cloning

### Errors

```bash
Error HH404: File @openzeppelin/contracts/token/ERC721/IERC721Metadata.sol, imported from @uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol, not found.
```

## simple-swap

Where I try to use the latest openzeppelin and this swap example https://github.com/Uniswap/uniswap-first-contract-example/blob/simple-swap-complete-example/test/SimpleSwap.test.js from this docs https://docs.uniswap.org/contracts/v3/guides/local-environment

### Errors

```bash
Error HH606: The project cannot be compiled, see reasons below.

These files import other files that use a different and incompatible version of Solidity:

  * contracts/MyToken.sol (^0.8.27) imports @openzeppelin/contracts/token/ERC20/ERC20.sol (>=0.6.0 <0.8.0)
```

## liquidty examples

Where I try this other example

https://docs.uniswap.org/contracts/v3/guides/providing-liquidity/setting-up and https://docs.uniswap.org/contracts/v3/guides/providing-liquidity/mint-a-position

### Errors

```bash
Error HH606: The project cannot be compiled, see reasons below.

These files import other files that use a different and incompatible version of Solidity:

  * contracts/MyToken.sol (^0.8.27) imports @openzeppelin/contracts/token/ERC20/ERC20.sol (>=0.6.0 <0.8.0)
```

# Example

## helper contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";

contract UniswapHelper is IERC721Receiver {
    INonfungiblePositionManager public positionManager;

    constructor(address _positionManager) {
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    function addLiquidity(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) external returns (uint256 tokenId) {
        // Approve tokens for position manager
        IERC20(token0).approve(address(positionManager), amount0Desired);
        IERC20(token1).approve(address(positionManager), amount1Desired);

        // Add liquidity
        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0Desired,
                amount1Desired: amount1Desired,
                amount0Min: 0,
                amount1Min: 0,
                recipient: msg.sender,
                deadline: block.timestamp
            });

        (tokenId, , , ) = positionManager.mint(params);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
```

## main contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Define an interface for UniswapHelper to interact with it
interface IUniswapHelper {
    function addLiquidity(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) external returns (uint256 tokenId);
}

contract MyToken is ERC20 {
    IUniswapHelper public uniswapHelper;

    constructor(address _uniswapHelper) ERC20("MyToken", "MTK") {
        uniswapHelper = IUniswapHelper(_uniswapHelper);
    }

    function provideLiquidity(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) external {
        // Call the addLiquidity function on the helper contract
        uint256 tokenId = uniswapHelper.addLiquidity(
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            amount0Desired,
            amount1Desired
        );

        // Handle tokenId if needed
    }
}
```

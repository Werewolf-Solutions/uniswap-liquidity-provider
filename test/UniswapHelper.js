const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("UniswapHelper", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployUniswapHelper() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const UniswapHelper = await ethers.getContractFactory("UniswapHelper");
    const uniswapHelper = await UniswapHelper.deploy();

    return { uniswapHelper, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should compile", async function () {
      await loadFixture(deployUniswapHelper);

      expect("We made it here!").to.equal("We made it here!");
    });
  });
});

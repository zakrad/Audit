const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "PonziContract";

describe(NAME, function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();

    const VictimFactory = await ethers.getContractFactory(NAME);
    const victimContract = await VictimFactory.deploy();
    await victimContract.waitForDeployment();

    return { victimContract, attackerWallet, owner };
  }

  describe("exploit", async function () {
    let victimContract;
    let attackerContract;
    let attackerWallet;
    before(async function () {
      ({ victimContract, attackerWallet } = await loadFixture(setup));
    });

    it("attack happens here", async function () {
      await victimContract.setDeadline(1724179261);
      const AttackerFactory = await ethers.getContractFactory(
        "PonziContractAttacker"
      );
      attackerContract = await AttackerFactory.connect(attackerWallet).deploy(
        victimContract.getAddress()
      );

      await attackerContract.attack({ value: ethers.parseEther("10") });
    });

    after(async function () {
      expect(await victimContract.owner()).to.be.equal(
        await attackerContract.getAddress()
      );

      expect(await attackerContract.victimBalance()).to.be.equal(0);
      expect(await attackerContract.balance()).to.be.equal(0);
    });
  });
});

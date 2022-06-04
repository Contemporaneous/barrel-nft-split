const { expect } = require("chai");
const { ethers } = require("hardhat");

let pif;
let accounts;
const totalSupply = 500;
const expectedSupply = 400;

beforeEach(async () => {
    accounts = await ethers.getSigners();
    const BarrelFactory = await ethers.getContractFactory("Barrel");
    barrel = await BarrelFactory.connect(accounts[0]).deploy(totalSupply, expectedSupply);
    await barrel.deployed();
});

describe("Deployment", function () {
  it("Should Deploy with the correct Values", async function () {

    expect(await barrel.totalSupply()).to.equal(totalSupply);
    expect(await barrel.expectedSupply()).to.equal(expectedSupply);
  });

  it("Should deploy with correct owner", async function () {
    expect(await barrel.owner()).to.equal(accounts[0].address);
  });
});
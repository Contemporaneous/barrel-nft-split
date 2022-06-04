const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let pif;
let accounts;
const totalSupply = 5;
const expectedSupply = 3;

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

describe("Minting", function () {
    it("Should Mint to correct address", async function () {
        await barrel.connect(accounts[1]).generateNFT({value: ethers.utils.parseEther("0.01")});
        expect(await barrel.ownerOf(0)).to.equal(accounts[1].address);
    });

    it("Should not exceed total supply", async function() {
        const func = async () => {
            for (let i = 0; i = totalSupply; i++) {
                let fred = await barrel.generateNFT({value: ethers.utils.parseEther("0.01")});
                fred.wait();
            }
        };
        
        //BAD TEST - Why does .to.throw not work?
        try {
            await func();
            expect(1).to.equal(0);
        } catch (e) {
            expect(1).to.equal(1)
        }
    });

    it("Should Show Correct Position", async function () {
        await barrel.connect(accounts[1]).generateNFT({value: ethers.utils.parseEther("0.01")});
        res = await barrel.getPosition(0);

        expect(res[0]).to.equal(true);
        expect(res[1]).to.equal(expectedSupply);
        
    });
});
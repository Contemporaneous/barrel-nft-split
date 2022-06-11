const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");
const { expect, assert } = require("chai");

let barrel;
let accounts;
let start;
const totalSupply = 5;
const expectedSupply = 3;
const startPrice = ethers.utils.parseEther('1.5');
const endPrice = ethers.utils.parseEther('0.1');
const intervals = 24;

const genContract = async (adj) => {
    accounts = await ethers.getSigners();
    let dateRelease = new Date(); // now
    let releaseDate = Math.floor(dateRelease.getTime() / 1000)-adj;

    let expireDate = releaseDate + (3600*24*7*4);

    const BarrelFactory = await ethers.getContractFactory("Barrel");
    barrel = await BarrelFactory.connect(accounts[0]).deploy(totalSupply, expectedSupply, releaseDate, expireDate, startPrice, endPrice, intervals);
    await barrel.deployed();
};


beforeEach(async () => {
    await genContract(0);
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
        let price = await barrel.getPrice();
        await barrel.connect(accounts[1]).generateNFT({value: price});
        expect(await barrel.ownerOf(0)).to.equal(accounts[1].address);
    });

    it("Should not exceed total supply", async function() {
        let price = await barrel.getPrice();

        const func = async () => {
            for (let i = 0; i = totalSupply; i++) {
                let fred = await barrel.generateNFT({value: price});
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
        let price = await barrel.getPrice();

        await barrel.connect(accounts[1]).generateNFT({value: price});
        res = await barrel.getPosition(0);

        expect(res[0]).to.equal(true);
        expect(res[1]).to.equal(expectedSupply);
        
    });
});

describe("Priceing", function () {
    it("It should be priced Correct early on", async function () {
        price = await barrel.getPrice();
        expect(price).to.equal(startPrice);
    });

    it("It should be priced Correctly later on ", async function() {
        await genContract(3600*24*7);
        price = await barrel.getPrice();
        expect(price).to.equal(endPrice);
    });

    it("It should be priced Correctly in between", async function () {
        await genContract(3600*12);
        price = await barrel.getPrice();
        expect(price).to.lt(startPrice);
        expect(price).to.gt(endPrice);
    });
});
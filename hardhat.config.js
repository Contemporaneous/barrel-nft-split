require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    "optimistic-kovan": {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    "localhost": {
      url: "http://127.0.0.1:8545",
      gas: 12000000,
      chainId: 31337,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
    }
  },
  etherscan: {
    apiKey: process.env.OP_ETHERSCAN_API_KEY,
  }
  
};

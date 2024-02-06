require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config() 
module.exports = {
  solidity: {
    version: "0.8.20",
    settings:{
      optimizer:{
        enabled: true,
        runs: 200
      },
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },

  networks:{
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_API_KEY}`,
      accounts: {
        mnemonic: process.env.SEED,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      // accounts: [
      //   process.env.ACC1_PK,
      // ],
    },

    goerli:{
      url:`https://eth-goerli.g.alchemy.com/v2/6VIk-hwmxSKdcxCMiZPKqE4P0mprIa3w`,
      accounts: {
        mnemonic: "", //paste your mnemonic key 
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    }
  },
};

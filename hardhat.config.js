require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-truffle5')
require('hardhat-deploy')
require('hardhat-deploy-ethers')
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

require("./scripts/deploy")
require("./scripts/initialize")


const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
}
let secret = require('./secrets.json');
const { privateKey, ropstenKey, ethscankey } = secret;



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  etherscan: {
    apiKey: ethscankey,
  },
  namedAccounts: {
    deployer: {
      localhost: 0,
      default: process.env.DEV_ADDR || 0,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    
    ],
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      url: 'http://127.0.0.1:8545',
      loggingEnabled: true,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      gasPrice: 1e11,
      chainId: 1,
    },
    hardhat: {
      forking: {
        enabled: process.env.FORKING === 'true',
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      },
      live: false,
      saveDeployments: true,
      tags: ['test', 'local'],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${ropstenKey}`,
      accounts: [privateKey], 
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 3e10,
      gasMultiplier: 2,
    }
    
    
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
}

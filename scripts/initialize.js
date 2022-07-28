const { task } = require('hardhat/config');
const settings = require('./initializeSettings')
require('@nomiclabs/hardhat-web3')
const { BN } = require('ethereumjs-util')
const erc20ABI = require('./erc20-abi');


task('initialize', "initialize contract")
    .addParam('addr', 'contract addr')
    .setAction(async (taskArgs, { web3 }) => {
        const { addr } = taskArgs
        const NFT1155 = await ethers.getContractFactory("NFT");
        const nft1155 = await NFT1155.attach(addr)
        const tx = await nft1155.initialize(settings.unlock, settings.uris, settings.amounts, settings.nums)
        console.log("initial contact finish at tx: ", tx.hash)
    })

task('approve', 'approve token')
    .addParam('addr', 'contract addr')
    .addParam('erc20', 'erc20 contract addr')
    .setAction(async (taskArgs, { web3 }) => {
        const { addr, erc20 } = taskArgs
        let erc20ContractInstance = new web3.eth.Contract(erc20ABI, erc20, { from: "0x74A0d83790A523cBB19Aefbe971Ad8CaB1388ab9"});
        const dec = await erc20ContractInstance.methods.decimals().call()
        console.log(dec)
        const tx = await erc20ContractInstance.methods.approve(addr, new BN(1000).pow(new BN(dec))).send();
        console.log("initapproveial 1000000000 at tx: ", tx.transactionHash)
    }) 

const settings = require('./deploySettings')
const { task } = require('hardhat/config');


task('deploy', "deploy contract")
    .setAction(async (taskArgs, { web3 }) => {
        const NFT1155 = await ethers.getContractFactory("NFT");
        const nft1155 = await NFT1155.deploy(settings.owner, settings.usdc);
        console.log(nft1155)
        console.log("NFT deployed to: ", nft1155.address, "  tx hash: ", nft1155.deployTransaction.hash);
    })    


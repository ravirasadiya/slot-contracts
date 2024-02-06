

const {ethers} = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
 

  const SecureWallet = await ethers.getContractFactory("SecureWallet");
  const secureWallet = await SecureWallet.deploy(owner.address);

  console.log("deployed to", secureWallet.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

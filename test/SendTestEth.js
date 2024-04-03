const ethers = require("ethers");

async function main() {
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Put your local hardhat node private key here
  const recipient = ""; // Put your MetaMask address here
  const amount = ethers.parseEther("1.0"); // 1 Ether

  // Connect to the local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Create a new wallet instance
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a transaction
  const tx = {
    to: recipient,
    value: amount,
  };

  // Send the transaction
  const txResponse = await wallet.sendTransaction(tx);
  console.log(`Transaction hash: ${txResponse.hash}`);

  // Wait for the transaction to be mined
  const receipt = await txResponse.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

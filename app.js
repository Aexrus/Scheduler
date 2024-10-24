const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const cron = require('node-cron');
require('dotenv').config();

/* 
 ******************************************************
 * CONFIGURATION SECTION
 * Purpose: Load environment variables and setup Alchemy Web3
 * Variables: 
 *  - PRIVATE_KEY: Your wallet's private key
 *  - ALCHEMY_RPC_URL: The Alchemy RPC endpoint URL
 *  - CONTRACT_ADDRESS: Smart contract address
 ******************************************************
*/

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

/*
 ******************************************************
 * ABI SECTION
 * Purpose: Define the ABI (Application Binary Interface) for the contract
 * Contract ABI: Only relevant portion (distributeDailyTokens function)
 ******************************************************
*/

// ABI of the contract (only include the relevant part)
const abi = [
  {
    "constant": false,
    "inputs": [],
    "name": "distributeDailyTokens",
    "outputs": [],
    "type": "function"
  }
];

/*
 ******************************************************
 * ALCHEMY & ACCOUNT SETUP
 * Purpose: Connect to Polygon testnet using Alchemy Web3 and 
 * create an account instance using the private key.
 * Variables:
 *  - web3: Alchemy Web3 instance
 *  - account: Account object created from the private key
 ******************************************************
*/

// Connect to Polygon testnet using Alchemy Web3
const web3 = createAlchemyWeb3(ALCHEMY_RPC_URL);

// Create account instance using the private key
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

/*
 ******************************************************
 * CONTRACT INSTANCE SETUP
 * Purpose: Create an instance of the smart contract using its ABI and address
 * Variable:
 *  - contract: Instance of the contract for calling its methods
 ******************************************************
*/

// Create contract instance
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

/*
 ******************************************************
 * FUNCTION: distributeTokens
 * Purpose: Call the "distributeDailyTokens" function of the contract
 * Actions:
 *  - Estimate gas for the transaction
 *  - Sign the transaction using the private key
 *  - Send the signed transaction to the blockchain
 * Logs:
 *  - Logs estimated gas
 *  - Handles and logs specific errors (e.g., "Too early for next mint")
 ******************************************************
*/

// Function to call the distributeDailyTokens function
async function distributeTokens() {
  try {
    const gasEstimate = await contract.methods.distributeDailyTokens().estimateGas({ from: account.address });
    console.log('Estimated gas:', gasEstimate);

    const tx = {
      from: account.address,
      to: CONTRACT_ADDRESS,
      gas: gasEstimate,
      data: contract.methods.distributeDailyTokens().encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (error) {
    if (error.message && error.message.includes("Too early for next mint")) {
      console.log('Skipped: It is too early for the next mint. Waiting for the correct time.');
    } else {
      console.error('An unexpected error occurred:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

/* ............................................................
 *  CRON JOB SCHEDULER
 *  Purpose: Schedule the cron job to run distributeTokens at 9:30 AM UTC every day
 *  Logs:
 *   - Logs current date and time when the cron job triggers
 * ............................................................
 */

cron.schedule('* * * * *', () => {
  console.log('Cron job triggered. Initiating token distribution at', new Date().toLocaleString());
  distributeTokens();
});

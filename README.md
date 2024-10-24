
# Token Distribution Automation Script

This project is an automated script that distributes daily tokens via a smart contract on the Polygon testnet/mainnet. The script is triggered daily at 9:30 AM UTC by a cron job and interacts with the smart contract using Alchemy Web3.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/your-repository.git
cd your-repository
```

### 2. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 3. Configure the `.env` File
Create a `.env` file in the root directory of your project and add the following environment variables. The `.env` file is used to store sensitive information such as your private key and the contract address.

#### 🔑 `.env` File Example:

```bash
PRIVATE_KEY=your_private_key_here
ALCHEMY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your-alchemy-api-key
CONTRACT_ADDRESS=your_contract_address_here
```

### 📝 Explanation of the Variables:
- **`PRIVATE_KEY`**: Your wallet's private key (used to sign transactions).
- **`ALCHEMY_RPC_URL`**: The Alchemy RPC endpoint for the Polygon testnet (you can get this from the Alchemy dashboard).
- **`CONTRACT_ADDRESS`**: The address of the deployed smart contract you are interacting with.

---

## 🛠️ How It Works

This script connects to the Polygon testnet using the Alchemy Web3 API and interacts with a smart contract that distributes daily tokens.

- **Function**: The script calls the `distributeDailyTokens` function from the smart contract.
- **Cron Job**: The script runs automatically every day at 9:30 AM UTC using a cron job.
- **Gas Estimation**: It estimates the gas required for the transaction before sending it.
- **Error Handling**: If it's too early for the next token distribution, the script will skip and log an appropriate message.

---

## ⏱️ Cron Job Schedule

The cron job is scheduled to run at **9:30 AM UTC** every day:
```javascript
cron.schedule('30 9 * * *', () => {
  console.log('Cron job triggered. Initiating token distribution at', new Date().toLocaleString());
  distributeTokens();
});
```

This ensures that tokens are distributed automatically without manual intervention.

---

## 📦 Additional Features

- **Error Logging**: Any unexpected errors are logged to the console with detailed messages and stack traces.
- **Gas Optimization**: The script estimates gas usage to ensure that the transaction can be processed smoothly.

---

## 🚨 Important Notes
- **Security**: Ensure that you keep your `.env` file private. Never share your private key or sensitive information in public repositories.
- **Testnet Only**: This script is currently configured for the Polygon **amoy testnet**. For mainnet usage, update the `ALCHEMY_RPC_URL` accordingly.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Contributing

Feel free to open issues or submit pull requests to contribute to the project. 

const Wallet = require('./wallet');
const TokenAccount = require("./tokenAccount");

// create a new TokenAccount
const account = new TokenAccount();

// create a new token with name "MyToken" and symbol "MTK"
account.createToken("MyToken", "MTK");

// // mint_to 100 tokens to account "A"
account.mint_to("MTK", "A", 100000);
console.log(account.getTokenBalance("MTK", "A"));






const wallet = new Wallet();
wallet.generateKeyPair();
wallet.createToken('Bitcoin', 'BTC');
wallet.createToken("MyToken", "MTK");
console.log(wallet);



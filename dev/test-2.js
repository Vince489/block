const Token = require('./token');
const TokenAccount = require('./tokenAccount');
const Blockchain = require('./blockchain');

let nonce = 2478
let previousBlockHash = '98yhu8657t6g'
let hash = 'hv576tf976u'
let amount = 100
let sender = 'address1'
let recipient = 'address2'



const VRT = new Blockchain();
const myToken = new Token('MyToken', 'MT', 1000);
const block = VRT.createNewBlock(nonce, previousBlockHash, hash);
const trans = VRT.createNewTransaction(amount, sender, recipient)
const add = VRT.addTransactionToPendingTransactions(trans)

const account1 = new TokenAccount(myToken, 'address1');
const account2 = new TokenAccount(myToken, 'address2');

myToken.balances.set(account1.ownerAddress, account1);
myToken.balances.set(account2.ownerAddress, account2);

// console.log(block); // Output: 900
// console.log(trans); 
console.log(VRT)// Output: 900
// console.log(account2.getBalance()); // Output: 100

// console.log(account1.getTokenBalance(myToken)); // Output: 900
// console.log(account2.getTokenBalance(myToken)); // Output: 100

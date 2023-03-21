const myToken = new Token('MyToken', 'MT', 1000);
const account1 = new TokenAccount(myToken, 'address1');
const account2 = new TokenAccount(myToken, 'address2');

myToken.balances.set(account1.ownerAddress, account1);
myToken.balances.set(account2.ownerAddress, account2);

account1.transfer(account2.ownerAddress, 100);
console.log(account1.getBalance()); // Output: 900
console.log(account2.getBalance()); // Output: 100

console.log(account1.getTokenBalance(myToken)); // Output: 900
console.log(account2.getTokenBalance(myToken)); // Output: 100

class TokenAccount {
  constructor(token, ownerAddress) {
    this.token = token;
    this.ownerAddress = ownerAddress;
    this.balance = 0;
  }

  transfer(toAddress, amount) {
    if (this.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const toAccount = this.token.balances.get(toAddress);
    if (!toAccount) {
      throw new Error('Invalid recipient');
    }

    this.balance -= amount;
    toAccount.balance += amount;
  }

  getBalance() {
    return this.balance;
  }

  getTokenBalance(token) {
    return token.balances.get(this.ownerAddress);
  }
}

module.exports = TokenAccount;

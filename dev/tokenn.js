class Token {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = 0;
    this.balances = new Map();
  }

  createMint(initialSupply) {
    if (this.totalSupply > 0) {
      throw new Error("A mint already exists for this token.");
    }
    this.totalSupply = initialSupply;
    this.balances.set("mint", initialSupply);
  }

  mint_to(account, amount) {
    if (!this.balances.has("mint")) {
      throw new Error("A mint has not been created for this token yet.");
    }
    let balance = this.balances.get(account) || 0;
    balance += amount;
    this.balances.set(account, balance);
    let mintBalance = this.balances.get("mint") || 0;
    mintBalance -= amount;
    this.balances.set("mint", mintBalance);
  }
}

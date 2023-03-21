class Token {
  constructor(name, symbol, totalSupply) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.balances = new Map();
  }
}

module.exports = Token;
class Token {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = 0;
    this.balances = new Map();
  }
}


module.exports = Token;
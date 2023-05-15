const Token = require("./token.js");

class TokenAccount {
  constructor() {
    this.tokens = new Map();
  }

  createToken(name, symbol) {
    let token = new Token(name, symbol);
    this.tokens.set(symbol, token);
  }

  getToken(symbol) {
    return this.tokens.get(symbol);
  }

  transfer(sender, recipient, symbol, amount) {
    let token = this.getToken(symbol);
    if (!token) {
      throw new Error("Token does not exist.");
    }
    token.transfer(sender, recipient, amount);
  }

  mint_to(symbol, account, amount) {
    let token = this.getToken(symbol);
    if (!token) {
      throw new Error("Token does not exist.");
    }
    token.mint_to(account, amount);
  }

  getTokenBalance(symbol, account) {
    let token = this.getToken(symbol);
    if (!token) {
      throw new Error("Token does not exist.");
    }
    return token.getTokenBalance(account);
  }
}

module.exports = TokenAccount;

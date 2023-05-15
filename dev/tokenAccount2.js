const Token = require("./token.js");

class TokenAccount {
  constructor() {
    this.tokens = new Map();
  }

  createToken(name, symbol) {
    // Add validation check for name and symbol inputs
    if (!name || !symbol) {
      throw new Error("Invalid input: name and symbol are required.");
    }
    let token = new Token(name, symbol);
    this.tokens.set(symbol, token);
  }

  getToken(symbol) {
    // Add validation check for symbol input
    if (!symbol) {
      throw new Error("Invalid input: symbol is required.");
    }
    return this.tokens.get(symbol);
  }

  transfer(sender, recipient, symbol, amount) {
    // Add validation checks for sender, recipient, symbol, and amount inputs
    if (!sender || !recipient || !symbol || amount <= 0) {
      throw new Error("Invalid input: sender, recipient, symbol, and amount are required and amount must be positive.");
    }
    let token = this.getToken(symbol);
    if (!token) {
      throw new Error("Token does not exist.");
    }
    token.transfer(sender, recipient, amount);
  }

  mint_to(symbol, account, amount) {
    // Add validation checks for symbol, account, and amount inputs
    if (!symbol || !account || amount <= 0) {
      throw new Error("Invalid input: symbol, account, and amount are required and amount must be positive.");
    }
    let token = this.getToken(symbol);
    if (!token) {
      throw new Error("Token does not exist.");
    }
    token.mint_to(account, amount);
  }

  getTokenBalance(symbol, account) {
    // Add validation checks for symbol and account inputs
    if (!symbol || !account) {
      throw new Error("Invalid input: symbol and account are required.");
    }
    let token = this.getToken(symbol);
    if (!token) {
      throw new Error("Token does not exist.");
    }
    return token.getTokenBalance(account);
  }
}

module.exports = TokenAccount;

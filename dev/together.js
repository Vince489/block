const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
const Block = require('./block');
const Transaction = require('./transaction');


class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = new Block(
      this.chain.length + 1,
      Date.now(),
      this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash
    );
  
    this.pendingTransactions = [];
    this.chain.push(newBlock);
  
    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, recipient) {
    const transactionId = uuid().split('-').join('');
    const newTransaction = new Transaction(amount, sender, recipient, transactionId);
    return newTransaction;
  }
  
  addTransactionToPendingTransactions(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock().index + 1;
  }
}

class Block {
  constructor(index, timestamp, transactions, nonce, hash, previousBlockHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = nonce;
    this.hash = hash;
    this.previousBlockHash = previousBlockHash;
  }
}

class Token {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = 0;
    this.balances = new Map();
  }
}

class Wallet {
  constructor() {
    this.tokenAccount = new Map();
    this.keyPair = null;
  }
}

class Transaction {
  constructor(amount, sender, recipient, transactionId) {
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.transactionId = transactionId;
  }
}